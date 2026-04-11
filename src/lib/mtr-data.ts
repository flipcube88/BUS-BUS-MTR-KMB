export const MTR_LINES = [
  { code: 'KTL', name: '觀塘綫', name_en: 'Kwun Tong Line', color: '#00A859' },
  { code: 'ISL', name: '港島綫', name_en: 'Island Line', color: '#007DC5' },
  { code: 'TWL', name: '荃灣綫', name_en: 'Tsuen Wan Line', color: '#E2231A' },
  { code: 'SIL', name: '南港島綫', name_en: 'South Island Line', color: '#B5A87F' },
  { code: 'TCL', name: '東涌綫', name_en: 'Tung Chung Line', color: '#F38B00' },
  { code: 'TKL', name: '將軍澳綫', name_en: 'Tseung Kwan O Line', color: '#A35EB5' },
  { code: 'AEL', name: '機場快綫', name_en: 'Airport Express', color: '#00888A' },
  { code: 'TML', name: '屯馬綫', name_en: 'Tuen Ma Line', color: '#9A3820' },
  { code: 'EAL', name: '東鐵綫', name_en: 'East Rail Line', color: '#61B4E4' },
  { code: 'DRL', name: '迪士尼綫', name_en: 'Disneyland Resort Line', color: '#F550A6' }
];

export const MTR_STATIONS: Record<string, { code: string; name: string; name_en: string }[]> = {
  KTL: [
    { code: 'WHA', name: '黃埔', name_en: 'Whampoa' },
    { code: 'HOM', name: '何文田', name_en: 'Ho Man Tin' },
    { code: 'YMT', name: '油麻地', name_en: 'Yau Ma Tei' },
    { code: 'MOK', name: '旺角', name_en: 'Mong Kok' },
    { code: 'PRE', name: '太子', name_en: 'Prince Edward' },
    { code: 'SKM', name: '石硤尾', name_en: 'Shek Kip Mei' },
    { code: 'KOT', name: '九龍塘', name_en: 'Kowloon Tong' },
    { code: 'LOF', name: '樂富', name_en: 'Lok Fu' },
    { code: 'WTS', name: '黃大仙', name_en: 'Wong Tai Sin' },
    { code: 'DIH', name: '鑽石山', name_en: 'Diamond Hill' },
    { code: 'CHH', name: '彩虹', name_en: 'Choi Hung' },
    { code: 'KOB', name: '九龍灣', name_en: 'Kowloon Bay' },
    { code: 'NTK', name: '牛頭角', name_en: 'Ngau Tau Kok' },
    { code: 'KWT', name: '觀塘', name_en: 'Kwun Tong' },
    { code: 'LAT', name: '藍田', name_en: 'Lam Tin' },
    { code: 'YAT', name: '油塘', name_en: 'Yau Tong' },
    { code: 'TIK', name: '調景嶺', name_en: 'Tiu Keng Leng' }
  ],
  ISL: [
    { code: 'KET', name: '堅尼地城', name_en: 'Kennedy Town' },
    { code: 'HKU', name: '香港大學', name_en: 'HKU' },
    { code: 'SYP', name: '西營盤', name_en: 'Sai Ying Pun' },
    { code: 'SHW', name: '上環', name_en: 'Sheung Wan' },
    { code: 'CEN', name: '中環', name_en: 'Central' },
    { code: 'ADM', name: '金鐘', name_en: 'Admiralty' },
    { code: 'WAC', name: '灣仔', name_en: 'Wan Chai' },
    { code: 'CAB', name: '銅鑼灣', name_en: 'Causeway Bay' },
    { code: 'TIN', name: '天后', name_en: 'Tin Hau' },
    { code: 'FOH', name: '炮台山', name_en: 'Fortress Hill' },
    { code: 'NOP', name: '北角', name_en: 'North Point' },
    { code: 'QUO', name: '鰂魚涌', name_en: 'Quarry Bay' },
    { code: 'TAK', name: '太古', name_en: 'Tai Koo' },
    { code: 'SWH', name: '西灣河', name_en: 'Sai Wan Ho' },
    { code: 'SKW', name: '筲箕灣', name_en: 'Shau Kei Wan' },
    { code: 'HFC', name: '杏花邨', name_en: 'Heng Fa Chuen' },
    { code: 'CHW', name: '柴灣', name_en: 'Chai Wan' }
  ],
  TWL: [
    { code: 'CEN', name: '中環', name_en: 'Central' },
    { code: 'ADM', name: '金鐘', name_en: 'Admiralty' },
    { code: 'TST', name: '尖沙咀', name_en: 'Tsim Sha Tsui' },
    { code: 'JOR', name: '佐敦', name_en: 'Jordan' },
    { code: 'YMT', name: '油麻地', name_en: 'Yau Ma Tei' },
    { code: 'MOK', name: '旺角', name_en: 'Mong Kok' },
    { code: 'PRE', name: '太子', name_en: 'Prince Edward' },
    { code: 'SSP', name: '深水埗', name_en: 'Sham Shui Po' },
    { code: 'CSW', name: '長沙灣', name_en: 'Cheung Sha Wan' },
    { code: 'LCK', name: '荔枝角', name_en: 'Lai Chi Kok' },
    { code: 'MEF', name: '美孚', name_en: 'Mei Foo' },
    { code: 'LAK', name: '荔景', name_en: 'Lai King' },
    { code: 'KWF', name: '葵芳', name_en: 'Kwai Fong' },
    { code: 'KWH', name: '葵興', name_en: 'Kwai Hing' },
    { code: 'TWH', name: '大窩口', name_en: 'Tai Wo Hau' },
    { code: 'TSW', name: '荃灣', name_en: 'Tsuen Wan' }
  ],
  SIL: [
    { code: 'ADM', name: '金鐘', name_en: 'Admiralty' },
    { code: 'OCP', name: '海洋公園', name_en: 'Ocean Park' },
    { code: 'WCH', name: '黃竹坑', name_en: 'Wong Chuk Hang' },
    { code: 'LET', name: '利東', name_en: 'Lei Tung' },
    { code: 'SOH', name: '海怡半島', name_en: 'South Horizons' }
  ],
  TCL: [
    { code: 'HOK', name: '香港', name_en: 'Hong Kong' },
    { code: 'KOW', name: '九龍', name_en: 'Kowloon' },
    { code: 'OLY', name: '奧運', name_en: 'Olympic' },
    { code: 'NAC', name: '南昌', name_en: 'Nam Cheong' },
    { code: 'LAK', name: '荔景', name_en: 'Lai King' },
    { code: 'TSY', name: '青衣', name_en: 'Tsing Yi' },
    { code: 'SUN', name: '欣澳', name_en: 'Sunny Bay' },
    { code: 'TUC', name: '東涌', name_en: 'Tung Chung' }
  ],
  TKL: [
    { code: 'NOP', name: '北角', name_en: 'North Point' },
    { code: 'QUO', name: '鰂魚涌', name_en: 'Quarry Bay' },
    { code: 'YAT', name: '油塘', name_en: 'Yau Tong' },
    { code: 'TIK', name: '調景嶺', name_en: 'Tiu Keng Leng' },
    { code: 'TKO', name: '將軍澳', name_en: 'Tseung Kwan O' },
    { code: 'LHP', name: '康城', name_en: 'LOHAS Park' },
    { code: 'HAO', name: '坑口', name_en: 'Hang Hau' },
    { code: 'POA', name: '寶琳', name_en: 'Po Lam' }
  ],
  AEL: [
    { code: 'HOK', name: '香港', name_en: 'Hong Kong' },
    { code: 'KOW', name: '九龍', name_en: 'Kowloon' },
    { code: 'TSY', name: '青衣', name_en: 'Tsing Yi' },
    { code: 'AIR', name: '機場', name_en: 'Airport' },
    { code: 'AWE', name: '博覽館', name_en: 'AsiaWorld-Expo' }
  ],
  TML: [
    { code: 'WKS', name: '烏溪沙', name_en: 'Wu Kai Sha' },
    { code: 'MOS', name: '馬鞍山', name_en: 'Ma On Shan' },
    { code: 'HEO', name: '恆安', name_en: 'Heng On' },
    { code: 'TSH', name: '大水坑', name_en: 'Tai Shui Hang' },
    { code: 'SHM', name: '石門', name_en: 'Shek Mun' },
    { code: 'CIO', name: '第一城', name_en: 'City One' },
    { code: 'STW', name: '沙田圍', name_en: 'Sha Tin Wai' },
    { code: 'CKT', name: '車公廟', name_en: 'Che Kung Temple' },
    { code: 'TAW', name: '大圍', name_en: 'Tai Wai' },
    { code: 'HIK', name: '顯徑', name_en: 'Hin Keng' },
    { code: 'DIH', name: '鑽石山', name_en: 'Diamond Hill' },
    { code: 'KAT', name: '啟德', name_en: 'Kai Tak' },
    { code: 'SUW', name: '宋皇臺', name_en: 'Sung Wong Toi' },
    { code: 'TKW', name: '土瓜灣', name_en: 'To Kwa Wan' },
    { code: 'HOM', name: '何文田', name_en: 'Ho Man Tin' },
    { code: 'HUH', name: '紅磡', name_en: 'Hung Hom' },
    { code: 'ETS', name: '尖東', name_en: 'East Tsim Sha Tsui' },
    { code: 'AUS', name: '柯士甸', name_en: 'Austin' },
    { code: 'NAC', name: '南昌', name_en: 'Nam Cheong' },
    { code: 'MEF', name: '美孚', name_en: 'Mei Foo' },
    { code: 'TWW', name: '荃灣西', name_en: 'Tsuen Wan West' },
    { code: 'KSR', name: '錦上路', name_en: 'Kam Sheung Road' },
    { code: 'YUL', name: '元朗', name_en: 'Yuen Long' },
    { code: 'LOP', name: '朗屏', name_en: 'Long Ping' },
    { code: 'TIS', name: '天水圍', name_en: 'Tin Shui Wai' },
    { code: 'SIH', name: '兆康', name_en: 'Siu Hong' },
    { code: 'TUM', name: '屯門', name_en: 'Tuen Mun' }
  ],
  EAL: [
    { code: 'ADM', name: '金鐘', name_en: 'Admiralty' },
    { code: 'EXX', name: '會展', name_en: 'Exhibition Centre' },
    { code: 'HUH', name: '紅磡', name_en: 'Hung Hom' },
    { code: 'MKK', name: '旺角東', name_en: 'Mong Kok East' },
    { code: 'KOT', name: '九龍塘', name_en: 'Kowloon Tong' },
    { code: 'TAW', name: '大圍', name_en: 'Tai Wai' },
    { code: 'SHT', name: '沙田', name_en: 'Sha Tin' },
    { code: 'FOT', name: '火炭', name_en: 'Fo Tan' },
    { code: 'RAC', name: '馬場', name_en: 'Racecourse' },
    { code: 'UNI', name: '大學', name_en: 'University' },
    { code: 'TAP', name: '大埔墟', name_en: 'Tai Po Market' },
    { code: 'TWO', name: '太和', name_en: 'Tai Wo' },
    { code: 'FAN', name: '粉嶺', name_en: 'Fanling' },
    { code: 'SHS', name: '上水', name_en: 'Sheung Shui' },
    { code: 'LOW', name: '羅湖', name_en: 'Lo Wu' },
    { code: 'LMC', name: '落馬洲', name_en: 'Lok Ma Chau' }
  ],
  DRL: [
    { code: 'SUN', name: '欣澳', name_en: 'Sunny Bay' },
    { code: 'DIS', name: '迪士尼', name_en: 'Disneyland Resort' }
  ]
};

export const STATION_NAMES: Record<string, string> = Object.values(MTR_STATIONS)
  .flat()
  .reduce((acc, station) => {
    acc[station.code] = station.name;
    return acc;
  }, {} as Record<string, string>);
