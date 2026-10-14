import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Search,
  Filter,
  Navigation,
  Compass,
  CheckCircle2,
  ExternalLink,
  Layers,
  Phone,
  Info
} from 'lucide-react';
import { DirectoryItem, CategoryType } from '../types.ts';
import { TOWNS } from '../data/seedData.ts';

interface InteractiveMapProps {
  items: DirectoryItem[];
  selectedTown: string;
  onTownChange: (town: string) => void;
  onSelectItem: (item: DirectoryItem) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  items,
  selectedTown,
  onTownChange,
  onSelectItem
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeItem, setActiveItem] = useState<DirectoryItem | null>(null);
  const [locatingUser, setLocatingUser] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Category color mapping
  const getCategoryColor = (category: CategoryType): string => {
    switch (category) {
      case 'education':
        return '#2563EB'; // Blue
      case 'healthcare':
        return '#DC2626'; // Red
      case 'accommodation':
        return '#D97706'; // Amber
      case 'government':
        return '#059669'; // Emerald
      case 'business':
        return '#7C3AED'; // Purple
      case 'destination':
        return '#9A542E'; // Terracotta
      default:
        return '#25251F';
    }
  };

  // Filter items based on category, town, and search query
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesTown =
      selectedTown === 'all' ||
      item.town.toLowerCase() === selectedTown.toLowerCase();
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.town.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.programsOrServices &&
        item.programsOrServices.some((p) =>
          p.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    return matchesCategory && matchesTown && matchesSearch;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Tharparkar district center (approx between Mithi and Islamkot)
    const map = L.map(mapContainerRef.current, {
      center: [24.7438, 70.0],
      zoom: 9,
      zoomControl: true,
      minZoom: 7,
      maxZoom: 18
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors | Tharparkar GIS'
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when filteredItems change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    filteredItems.forEach((item) => {
      const color = getCategoryColor(item.category);

      // Custom HTML Marker Pin
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            border: 2px solid #ffffff;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            <div style="
              width: 9px;
              height: 9px;
              background-color: #ffffff;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      });

      const marker = L.marker([item.latitude, item.longitude], {
        icon: customIcon
      });

      // Rich popup content
      const popupHtml = `
        <div style="padding: 12px; max-width: 260px; font-family: sans-serif;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="
              background: ${color}15;
              color: ${color};
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              padding: 2px 6px;
              border-radius: 4px;
            ">${item.category}</span>
            <span style="font-size: 10px; color: #666;">• ${item.town}</span>
          </div>
          <h4 style="margin: 4px 0 6px; font-size: 14px; font-weight: 700; color: #25251F; line-height: 1.3;">
            ${item.name}
          </h4>
          <p style="margin: 0 0 8px; font-size: 11px; color: #555; line-height: 1.4;">
            ${item.address}
          </p>
          ${
            item.phone
              ? `<div style="font-size: 11px; color: #444; margin-bottom: 6px;">📞 ${item.phone}</div>`
              : ''
          }
          <div style="display: flex; gap: 6px; margin-top: 8px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}"
               target="_blank"
               rel="noopener noreferrer"
               style="
                 flex: 1;
                 background: #9A542E;
                 color: #fff;
                 text-align: center;
                 font-size: 11px;
                 font-weight: 600;
                 padding: 5px 8px;
                 border-radius: 6px;
                 text-decoration: none;
               ">Get Directions ↗</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setActiveItem(item);
      });

      markersGroup.addLayer(marker);
    });

    // Auto fit bounds if items exist
    if (filteredItems.length > 0) {
      const groupBounds = L.latLngBounds(
        filteredItems.map((i) => [i.latitude, i.longitude])
      );
      map.fitBounds(groupBounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [filteredItems]);

  // Handle Town Change Pan
  useEffect(() => {
    if (!mapInstanceRef.current || selectedTown === 'all') return;
    const targetTown = TOWNS.find(
      (t) => t.name.toLowerCase() === selectedTown.toLowerCase()
    );
    if (targetTown) {
      mapInstanceRef.current.flyTo(
        [targetTown.latitude, targetTown.longitude],
        12,
        { duration: 1.5 }
      );
    }
  }, [selectedTown]);

  // Locate User
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocatingUser(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 12);
          L.circleMarker([latitude, longitude], {
            radius: 8,
            fillColor: '#2563EB',
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9
          })
            .addTo(mapInstanceRef.current)
            .bindPopup('<b>Your Current Location</b>')
            .openPopup();
        }
      },
      (err) => {
        setLocatingUser(false);
        console.warn('Geolocation denied or unavailable:', err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const categories: { id: string; label: string; color: string }[] = [
    { id: 'all', label: 'All Services', color: '#25251F' },
    { id: 'education', label: 'Education', color: '#2563EB' },
    { id: 'healthcare', label: 'Healthcare', color: '#DC2626' },
    { id: 'destination', label: 'Tourism & Heritage', color: '#9A542E' },
    { id: 'accommodation', label: 'Hotels & Rest Houses', color: '#D97706' },
    { id: 'government', label: 'Government Offices', color: '#059669' },
    { id: 'business', label: 'Businesses & Artisans', color: '#7C3AED' }
  ];

  return (
    <section id="map" className="py-20 lg:py-28 bg-[#25251F] text-[#F8F4EC] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8B786]/20 text-[#D8B786] text-xs font-bold uppercase tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Geographic Information System</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8F4EC] tracking-tight">
            Explore Tharparkar District Map
          </h2>
          <p className="text-sm sm:text-base text-white/70 mt-3">
            Accurate geographic mapping of verified schools, colleges, DHQ & THQ hospitals, historic landmarks, STDC resorts, and public administration offices across Mithi, Islamkot, Nagarparkar, Diplo, Chachro, and Dahli.
          </p>
        </div>

        {/* Filters & Search Control Bar */}
        <div className="bg-[#1C1C17] border border-[#D8B786]/25 rounded-2xl p-4 sm:p-5 mb-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-[#D8B786] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search institution, hospital, fort, town..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#25251F] border border-[#D8B786]/30 text-white pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#D8B786] placeholder-white/40"
              />
            </div>

            {/* Town Selector */}
            <div className="md:col-span-3">
              <select
                value={selectedTown}
                onChange={(e) => onTownChange(e.target.value)}
                aria-label="Filter directory by Taluka or Settlement"
                className="w-full bg-[#25251F] border border-[#D8B786]/30 text-white px-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#D8B786]"
              >
                <option value="all">All Talukas & Settlements</option>
                {TOWNS.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name} (Taluka {t.taluka})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Action Tools */}
            <div className="md:col-span-5 flex items-center justify-end gap-2">
              <button
                onClick={handleLocateMe}
                disabled={locatingUser}
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#D8B786] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
                title="Locate my current position"
              >
                <Navigation className={`w-4 h-4 ${locatingUser ? 'animate-spin' : ''}`} />
                <span>{locatingUser ? 'Locating...' : 'My Location'}</span>
              </button>

              <button
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([24.7438, 70.0], 9);
                  }
                  setActiveCategory('all');
                  onTownChange('all');
                  setSearchTerm('');
                }}
                className="px-3.5 py-2.5 rounded-xl bg-[#D8B786]/20 hover:bg-[#D8B786]/30 text-[#D8B786] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#D8B786]/40"
              >
                <Layers className="w-4 h-4" />
                <span>Reset View</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4 pt-3 border-t border-white/10">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#9A542E] text-white shadow-md'
                      : 'bg-[#25251F] text-white/80 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Map and Side-List Synchronized View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Leaflet Map Container */}
          <div className="lg:col-span-8 bg-[#1C1C17] p-2 sm:p-3 rounded-2xl border border-[#D8B786]/20 shadow-2xl relative">
            <div
              ref={mapContainerRef}
              className="w-full h-[450px] sm:h-[550px] lg:h-[620px] rounded-xl overflow-hidden"
              style={{ zIndex: 10 }}
            />

            {/* Floating Map Legend */}
            <div className="absolute bottom-6 left-6 bg-[#25251F]/90 backdrop-blur-md p-3 rounded-xl border border-white/15 text-[11px] shadow-xl z-20 hidden sm:block">
              <div className="font-bold text-[#D8B786] mb-1.5 uppercase tracking-wider text-[10px]">
                Map Markers Legend
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                  <span>Education</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                  <span>Healthcare</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9A542E]" />
                  <span>Tourist Site</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                  <span>Hotels/Lodges</span>
                </div>
              </div>
            </div>
          </div>

          {/* Synchronized Results List */}
          <div className="lg:col-span-4 bg-[#1C1C17] border border-[#D8B786]/20 rounded-2xl p-4 sm:p-5 h-[450px] sm:h-[550px] lg:h-[620px] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div>
                <span className="text-xs text-[#D8B786] font-semibold uppercase tracking-wider">
                  Synchronized Results
                </span>
                <h3 className="font-bold text-base text-white">
                  {filteredItems.length} Verified Locations
                </h3>
              </div>
              <span className="text-xs bg-[#9A542E]/30 text-[#D8B786] px-2 py-0.5 rounded-md border border-[#9A542E]/40 font-mono">
                {selectedTown !== 'all' ? selectedTown : 'District Wide'}
              </span>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
              {filteredItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/60">
                  <Info className="w-8 h-8 text-[#D8B786] mb-2 opacity-60" />
                  <p className="text-sm font-semibold">No locations found</p>
                  <p className="text-xs text-white/40 mt-1">
                    Try adjusting your category filter, town selector, or search keyword.
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const isSelected = activeItem?.id === item.id;
                  const catColor = getCategoryColor(item.category);

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setActiveItem(item);
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.flyTo(
                            [item.latitude, item.longitude],
                            14,
                            { duration: 1.2 }
                          );
                        }
                      }}
                      className={`p-3.5 rounded-xl transition-all cursor-pointer border text-left ${
                        isSelected
                          ? 'bg-[#25251F] border-[#D8B786] shadow-lg scale-[1.01]'
                          : 'bg-[#25251F]/60 hover:bg-[#25251F] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase"
                          style={{
                            backgroundColor: `${catColor}20`,
                            color: catColor
                          }}
                        >
                          {item.category}
                        </span>
                        <span className="text-[11px] text-white/60 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#D8B786]" />
                          {item.town}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-[#F8F4EC] leading-snug line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-white/60 line-clamp-2 mt-1">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10 text-xs">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectItem(item);
                          }}
                          className="text-[#D8B786] hover:underline font-semibold flex items-center gap-1"
                        >
                          View Details &rarr;
                        </button>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-white/60 hover:text-white flex items-center gap-1"
                        >
                          <span>Directions</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
