export enum AccountType {
  DONATION_CENTER = 'donation_center',
  INDIVIDUAL = 'individual',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  SYSTEM = 'system',
}

export enum AccountStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SHADOW_BANNED = 'shadow_banned',
  DISABLED = 'disabled',
}

export enum DonorIdentificationType {
  PASSPORT = 'passport',
  VOTER_CARD = 'voter_card',
  NATIONAL_IDENTITY_CARD = 'national_identity_card',
}

export enum BloodGroup {
  APositive = 'A+',
  ANegative = 'A-',
  BPositive = 'B+',
  BNegative = 'B-',
  ABPositive = 'AB+',
  ABNegative = 'AB-',
  OPositive = 'O+',
  ONegative = 'O-',
}

export enum Genotype {
  AA = 'AA',
  AS = 'AS',
  SS = 'SS',
  AC = 'AC',
  SC = 'SC',
}

export enum OptimizedImageType {
  thumbnail = 'thumbnail',
  logo = 'logo',
  productImage = 'product-image',
  coverImage = 'cover-image',
  medium = 'medium',
  large = 'large',
}

export enum AppointmentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  MISSED = 'missed',
  NO_SHOW = 'no_show',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum NotificationType {
  DEFAULT = 'default',
  SUPPORT_INQUIRY = 'support_inquiry',
  APPOINTMENT_REMINDER = 'appointment_reminder',
  APPOINTMENT_CONFIRMATION = 'appointment_confirmation',
}

export enum ListItemType {
  DONATION_CENTER = 'DONATION_CENTER',
  CAMPAIGN = 'CAMPAIGN',
}
