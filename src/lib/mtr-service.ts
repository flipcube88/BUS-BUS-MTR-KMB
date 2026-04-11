export interface MtrEta {
  seq: string;
  dest: string;
  plat: string;
  time: string;
  ttnt: string;
  valid: string;
  source: string;
}

export interface MtrSchedule {
  UP?: MtrEta[];
  DOWN?: MtrEta[];
}

export async function getMtrSchedule(line: string, station: string): Promise<MtrSchedule | null> {
  try {
    const res = await fetch(`https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${line}&sta=${station}`);
    const data = await res.json();
    if (data.status === 1 && data.data && data.data[`${line}-${station}`]) {
      return data.data[`${line}-${station}`];
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}
