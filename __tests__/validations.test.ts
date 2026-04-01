import { describe, it, expect } from 'vitest';
import { contactSchema } from '../lib/validations';

describe('Contact Validation Schema', () => {
  describe('Phone Number Validation', () => {
    
    // Valid Phone Numbers
    const validPhones = [
      "", 
      "+1 555-123-4567",
      "(555) 123-4567",
      "555-123-4567",
      "+44 20 7123 4567",
      "+33 1 23 45 67 89",
      "+61 412 345 678",
      "0800 1111",
      "1234567"
    ];

    validPhones.forEach(phone => {
      it(`should accept valid phone format: "${phone}"`, () => {
        const result = contactSchema.safeParse({
          fullName: "John Doe",
          targetRoles: "Software Engineer",
          socials: {
            email: "john@example.com",
            phone: phone,
          }
        });
        expect(result.success).toBe(true);
      });
    });

    // Invalid Phone Numbers
    const invalidPhones = [
      "abc", 
      "123", // Too short
      "555-123-abcd", // Contains characters
      "123456789012345678901", // Too long (over 20)
      "+++1234567", // Too many pluses
    ];

    invalidPhones.forEach(phone => {
      it(`should reject invalid phone format: "${phone}"`, () => {
        const result = contactSchema.safeParse({
          fullName: "John Doe",
          targetRoles: "Software Engineer",
          socials: {
            email: "john@example.com",
            phone: phone,
          }
        });
        expect(result.success).toBe(false);
      });
    });

  });
});
