export interface KmbRoute {
  route: string;
  bound: string;
  service_type: string;
  orig_en: string;
  orig_tc: string;
  dest_en: string;
  dest_tc: string;
}

export interface KmbStop {
  stop: string;
  name_en: string;
  name_tc: string;
  lat: string;
  long: string;
}

export interface KmbRouteStop {
  route: string;
  bound: string;
  service_type: string;
  seq: string;
  stop: string;
}

export interface KmbEta {
  eta: string;
  eta_seq: number;
  rmk_tc: string;
  rmk_en: string;
  dir: string;
}

export async function getKmbRoute(route: string, bound: 'inbound' | 'outbound', serviceType: string = '1'): Promise<KmbRoute | null> {
  try {
    const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route/${route}/${bound}/${serviceType}`);
    const data = await res.json();
    return data.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getKmbRouteStops(route: string, bound: 'inbound' | 'outbound', serviceType: string = '1'): Promise<KmbRouteStop[]> {
  try {
    const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${bound}/${serviceType}`);
    const data = await res.json();
    return data.data || [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getKmbStop(stopId: string): Promise<KmbStop | null> {
  try {
    const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop/${stopId}`);
    const data = await res.json();
    return data.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getKmbEta(stopId: string, route: string, serviceType: string = '1'): Promise<KmbEta[]> {
  try {
    const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/eta/${stopId}/${route}/${serviceType}`);
    const data = await res.json();
    return data.data || [];
  } catch (e) {
    console.error(e);
    return [];
  }
}
