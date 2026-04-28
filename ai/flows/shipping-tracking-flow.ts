'use server';
/**
 * @fileOverview A Genkit flow for tracking shipments via Shipping.
 *
 * - getShippingTrackingInfo - A function that fetches tracking information for a given tracking number.
 * - ShippingTrackingInput - The input type for the tracking function.
 * - ShippingTrackingOutput - The return type for the tracking function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';


const ShippingTrackingInputSchema = z.object({
  trackingNumber: z.string().describe('The Shipping tracking number.'),
});
export type ShippingTrackingInput = z.infer<typeof ShippingTrackingInputSchema>;

const TrackingEventSchema = z.object({
  date: z.string().describe('The date and time of the event.'),
  location: z.string().describe('The location where the event occurred.'),
  status: z.string().describe('The description of the tracking event.'),
});

const ShippingTrackingOutputSchema = z.object({
  trackingNumber: z.string().describe('The tracking number.'),
  currentStatus: z.string().describe('The current high-level status of the shipment.'),
  events: z.array(TrackingEventSchema).describe('A list of all tracking events, from newest to oldest.'),
});
export type ShippingTrackingOutput = z.infer<typeof ShippingTrackingOutputSchema>;


// Mock data function to simulate API responses
function getMockTrackingData(trackingNumber: string): ShippingTrackingOutput | null {
    if (!trackingNumber.toUpperCase().startsWith('YLD')) {
        return null;
    }

    // Based on the last digit, return different scenarios for demonstration
    const lastDigit = parseInt(trackingNumber.slice(-1), 10) % 4;

    const baseEvents = [
        { date: '2024-05-20 09:15', location: 'Alger, Centre', status: 'Colis reçu au hub' },
        { date: '2024-05-20 14:30', location: 'Alger, Centre', status: 'Expédition en transit' },
    ];

    switch (lastDigit) {
        case 0: // Delivered
            return {
                trackingNumber,
                currentStatus: 'Livré',
                events: [
                    { date: '2024-05-22 11:45', location: 'Oran', status: 'Livré' },
                    { date: '2024-05-21 10:00', location: 'Oran', status: 'En attente de livraison' },
                    ...baseEvents,
                ].reverse(),
            };
        case 1: // In Transit
            return {
                trackingNumber,
                currentStatus: 'En transit',
                events: [
                     { date: '2024-05-21 08:20', location: 'Hub de Sétif', status: 'Colis arrivé au hub' },
                    ...baseEvents
                ].reverse(),
            };
        case 2: // Returned
             return {
                trackingNumber,
                currentStatus: 'Retourné',
                events: [
                    { date: '2024-05-23 16:00', location: 'Alger, Centre', status: 'Retourné à l\'expéditeur' },
                    { date: '2024-05-22 12:00', location: 'Constantine', status: 'Tentative de livraison échouée' },
                     ...baseEvents
                ].reverse(),
            };
        default: // Not Found / Invalid
            return null;
    }
}


export async function getShippingTrackingInfo(input: ShippingTrackingInput): Promise<ShippingTrackingOutput> {
  return shippingTrackingFlow(input);
}


const shippingTrackingFlow = ai.defineFlow(
  {
    name: 'shippingTrackingFlow',
    inputSchema: ShippingTrackingInputSchema,
    outputSchema: ShippingTrackingOutputSchema,
  },
  async (input) => {
    // In a real implementation, you would make an API call to Shipping here.
    // For now, we use a mock function.
    // e.g., const response = await fetch(`https://api.Shipping.com/v1/tracking/${input.trackingNumber}`, { headers: ... });
    // const data = await response.json();
    
    const mockData = getMockTrackingData(input.trackingNumber);

    if (!mockData) {
        throw new Error('Tracking number not found or invalid.');
    }
    
    return mockData;
  }
);
