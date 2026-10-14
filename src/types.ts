export type CategoryType =
  | 'education'
  | 'healthcare'
  | 'accommodation'
  | 'government'
  | 'business'
  | 'destination';

export type SubCategoryType =
  // Education
  | 'govt_boys_school'
  | 'govt_girls_school'
  | 'private_school'
  | 'boys_college'
  | 'girls_college'
  | 'govt_college'
  | 'private_college'
  | 'university'
  | 'medical_nursing'
  | 'engineering_tech'
  | 'vocational_training'
  // Healthcare
  | 'govt_hospital'
  | 'private_hospital'
  | 'bhu' // Basic Health Unit
  | 'rhc' // Rural Health Center
  | 'clinic'
  | 'diagnostic_lab'
  | 'pharmacy'
  // Accommodation
  | 'hotel'
  | 'resort'
  | 'guest_house'
  | 'rest_house'
  // Government
  | 'district_admin'
  | 'police_security'
  | 'judiciary'
  | 'education_dept'
  | 'health_dept'
  | 'municipal'
  | 'utility_service'
  | 'nadra'
  // Business
  | 'bank'
  | 'tour_operator'
  | 'handicraft_artisan'
  | 'commercial_office'
  | 'retail_market'
  // Tourist Destination
  | 'heritage_site'
  | 'natural_landscape'
  | 'religious_site'
  | 'viewpoint'
  | 'cultural_complex';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export interface DirectoryItem {
  id: string;
  name: string;
  category: CategoryType;
  subCategory: SubCategoryType;
  town: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  description: string;
  programsOrServices?: string[];
  ownership?: 'Government' | 'Private' | 'Semi-Government' | 'Trust/NGO';
  genderType?: 'Boys' | 'Girls' | 'Co-education' | 'All';
  photos: string[];
  verificationStatus: VerificationStatus;
  sourceReference: string;
  lastUpdated: string;
  facilities?: string[];
  rating?: number;
  hours?: string;
}

export interface TownInfo {
  id: string;
  name: string;
  taluka: string;
  latitude: number;
  longitude: number;
  description: string;
  populationEstimate?: string;
  highlights: string[];
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: string;
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  targetId?: string;
  details: string;
  timestamp: string;
}

export interface SiteSettings {
  heroHeading: string;
  heroSubtitle: string;
  heroButtonPrimary: string;
  heroButtonSecondary: string;
  heroButtonTertiary: string;
  heroImage: string;
  emergencyNotice?: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'superadmin' | 'editor' | 'contributor';
  token?: string;
}
