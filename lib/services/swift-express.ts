export interface SwiftExpressOrderData {
  reference?: string;
  nom_client: string;
  telephone: string;
  telephone_2?: string;
  adresse: string;
  code_postal?: string;
  commune: string;
  code_wilaya: string | number; // 1-58
  montant: number;
  remarque?: string;
  produit?: string;
  boutique?: string;
  type: 1 | 2 | 3 | 4; // 1 = Livraison, 2 = Echange, 3 = PICKUP, 4 = Recouvrement
  stop_desk?: 0 | 1;
  fragile?: 0 | 1;
}

export class SwiftExpressService {
  private static get baseUrl() {
    // ✅ FIX: Use app.ecotrack.dz (not api.ecotrack.dz)
    return process.env.SWIFT_EXPRESS_API_URL || 'https://app.ecotrack.dz/api/v1';
  }

  private static get apiKey() {
    return process.env.SWIFT_EXPRESS_API_KEY || '';
  }

  private static get headers() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Verify if the API Token is valid
   */
  static async verifyToken() {
    try {
      const response = await fetch(`${this.baseUrl}/verify/token?api_token=${this.apiKey}`, {
        method: 'GET',
        headers: this.headers,
      });
      return await response.json();
    } catch (error) {
      console.error('Swift Express API Error - Verify Token:', error);
      throw new Error('Failed to verify token with Swift Express');
    }
  }

  /**
   * Create a new shipment/order
   */
  static async createOrder(orderData: SwiftExpressOrderData) {
    try {
      const url = `${this.baseUrl}/create/order`;

      const bodyParams = {
        ...orderData,
        code_wilaya: Number(orderData.code_wilaya),
        api_token: this.apiKey,
      };

      console.log('Sending request to Swift Express API:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(bodyParams),
      });

      const responseText = await response.text();
      console.log('Swift Express API Response:', responseText);

      if (!response.ok) {
        throw new Error(`Swift Express API Error: ${response.status} - ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Failed to parse Swift Express response: ${responseText}`);
      }

      // Some EcoTrack versions return the data inside an array or with different success keys
      const result = Array.isArray(data) ? data[0] : data;
      
      if (result.success === false || result.status === 'error') {
        throw new Error(`Swift API returned error: ${result.message || result.error || JSON.stringify(result)}`);
      }

      // Ensure we normalize the tracking number field
      return {
        ...result,
        tracking: result.tracking || result.tracking_number || result.bar_code,
        id: result.id || result.order_id
      };
    } catch (error) {
      console.error('Swift Express API Error - Create Order:', error);
      throw error;
    }
  }

  /**
   * Track an order by its tracking number
   */
  static async trackOrder(trackingNumber: string) {
    try {
      const response = await fetch(`${this.baseUrl}/get/tracking/info`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          tracking: trackingNumber,
          api_token: this.apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Swift Express Tracking Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Swift Express API Error - Track Order:', error);
      throw error;
    }
  }

  /**
   * Get available Wilayas
   */
  static async getWilayas() {
    try {
      const response = await fetch(`${this.baseUrl}/get/wilayas?api_token=${this.apiKey}`, {
        method: 'GET',
        headers: this.headers,
      });
      return await response.json();
    } catch (error) {
      console.error('Swift Express API Error - Get Wilayas:', error);
      throw error;
    }
  }

  /**
   * Get available Communes for a specific Wilaya
   */
  static async getCommunes(wilayaId?: number | string) {
    try {
      const url = wilayaId
        ? `${this.baseUrl}/get/communes?wilaya_id=${wilayaId}&api_token=${this.apiKey}`
        : `${this.baseUrl}/get/communes?api_token=${this.apiKey}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers,
      });
      return await response.json();
    } catch (error) {
      console.error('Swift Express API Error - Get Communes:', error);
      throw error;
    }
  }

  /**
   * Get Shipping Fees
   */
  static async getFees() {
    try {
      const url = `${this.baseUrl}/get/fees?api_token=${this.apiKey}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers,
      });
      return await response.json();
    } catch (error) {
      console.error('Swift Express API Error - Get Fees:', error);
      throw error;
    }
  }
}
