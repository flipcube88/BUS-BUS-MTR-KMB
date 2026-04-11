const BASE_URL = 'https://rt.data.gov.hk/v1/transport/citybus-nwfb';

export interface CtbRoute {
  co: string;
  route: string;
  orig_tc: string;
  orig_en: string;
  dest_tc: string;
  dest_en: string;
  data_timestamp: string;
}

export interface CtbRouteStop {
  co: string;
  route: string;
  dir: string;
  seq: number;
  stop: string;
  data_timestamp: string;
}

export interface CtbStop {
  stop: string;
  name_tc: string;
  name_en: string;
  lat: string;
  long: string;
  data_timestamp: string;
}

export interface CtbEta {
  co: string;
  route: string;
  dir: string;
  seq: number;
  eta: string;
  eta_seq: number;
  rmk_tc: string;
  rmk_en: string;
  data_timestamp: string;
}

export async function getCtbRoute(route: string): Promise<CtbRoute | null> {
  try {
    const res = await fetch(`${BASE_URL}/route/ctb/${route}`);
    const data = await res.json();
    return data.data || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getCtbRouteStops(route: string, bound: 'inbound' | 'outbound'): Promise<CtbRouteStop[]> {
  try {
    const dir = bound === 'inbound' ? 'inbound' : 'outbound';
    const res = await fetch(`${BASE_URL}/route-stop/ctb/${route}/${dir}`);
    const data = await res.json();
    return data.data || [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getCtbStop(stopId: string): Promise<CtbStop | null> {
  try {
    const res = await fetch(`${BASE_URL}/stop/${stopId}`);
    const data = await res.json();
    return data.data || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getCtbEta(stopId: string, route: string): Promise<CtbEta[]> {
  try {
    const res = await fetch(`${BASE_URL}/eta/ctb/${stopId}/${route}`);
    const data = await res.json();
    return data.data || [];
  } catch (e) {
    console.error(e);
    return [];
  }
}
