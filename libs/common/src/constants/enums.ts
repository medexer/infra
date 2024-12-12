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
  VOTER_CARD = 'voter_card',
  NATIONAL_IDENTITY_CARD = 'national_identity_card',
}

export enum BloodGroup {
  APositive = "A+",
  ANegative = "A-",
  BPositive = "B+",
  BNegative = "B-",
  ABPositive = "AB+",
  ABNegative = "AB-",
  OPositive = "O+",
  ONegative = "O-",
}

export enum Genotype {
  AA = "AA",
  AS = "AS",
  SS = "SS",
  AC = "AC",
  SC = "SC",
}