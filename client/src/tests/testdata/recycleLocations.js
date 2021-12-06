export const recycleMaterials = { results:[
  { 'code': 120, 'name': 'Poistotekstiili' },
  { 'code': 119, 'name': 'Rakennus- ja purkujäte' },
  { 'code': 118, 'name': 'Kyllästetty puu' },
  { 'code': 117, 'name': 'Puu' },
  { 'code': 116, 'name': 'Lamput' },
  { 'code': 115, 'name': 'Ajoneuvoakut (lyijy)' },
  { 'code': 114, 'name': 'Muu jäte' },
  { 'code': 113, 'name': 'Tekstiili' },
  { 'code': 111, 'name': 'Muovi' },
  { 'code': 110, 'name': 'Kannettavat akut ja paristot' },
  { 'code': 109, 'name': 'Sähkölaitteet (SER)' },
  { 'code': 108, 'name': 'Vaarallinen jäte' },
  { 'code': 107, 'name': 'Lasi' },
  { 'code': 106, 'name': 'Metalli' },
  { 'code': 105, 'name': 'Kartonki' },
  { 'code': 104, 'name': 'Pahvi' },
  { 'code': 103, 'name': 'Paperi' },
  { 'code': 102, 'name': 'Energiajäte' },
  { 'code': 101, 'name': 'Puutarhajäte' },
  { 'code': 100, 'name': 'Sekajäte' }
] }

export const validLocation1 = {
  'spot_id': 1218666057,
  'name': 'Alueellinen keräyspiste',
  'operator': 'Suomen Keräyspaperi tuottajayhteisö Oy',
  'contact_info': '(09) 228 191',
  'address': 'Lars Sonckin tie 8',
  'postal_code': '00570',
  'municipality': 'Helsinki',
  'post_office': 'Kulosaari',
  'geometry': {
    'coordinates': [
      25.01431,
      60.18233
    ],
    'type': 'Point'
  },
  'materials': [
    {
      'code': 103,
      'name': 'Paperi'
    }
  ],
  'opening_hours_en': '',
  'opening_hours_fi': '',
  'opening_hours_sv': '',
  'description_en': '',
  'description_fi': '<p>Granfeltintie P-Alue</p>',
  'description_sv': '',
  'occupied': false,
  'additional_details': ''
}

export const validLocation2 = {
  'spot_id': 1218666054,
  'name': 'Alueellinen keräyspiste',
  'operator': 'Suomen Keräyspaperi tuottajayhteisö Oy',
  'contact_info': '(09) 228 191',
  'address': 'Pannipolku 2',
  'postal_code': '00430',
  'municipality': 'Helsinki',
  'post_office': 'Hakuninmaa',
  'geometry': {
    'coordinates': [
      24.88702,
      60.25425
    ],
    'type': 'Point'
  },
  'materials': [
    {
      'code': 103,
      'name': 'Paperi'
    }
  ],
  'opening_hours_en': '',
  'opening_hours_fi': '',
  'opening_hours_sv': '',
  'description_en': '',
  'description_fi': '<p>Uurtajantie 7, Vakkatie</p>',
  'description_sv': '',
  'occupied': false,
  'additional_details': ''
}

export const nullCoordinatesLocation =
{
  'spot_id': 1218671911,
  'name': 'Alueellinen keräyspiste',
  'operator': 'Suomen Keräyspaperi tuottajayhteisö Oy',
  'contact_info': '(09) 228 191',
  'address': 'Vanhis',
  'postal_code': '',
  'municipality': 'Kajaani',
  'post_office': 'Kajaani',
  'geometry': null,
  'materials': [
    {
      'code': 105,
      'name': 'Kartonki'
    }
  ],
  'opening_hours_en': '',
  'opening_hours_fi': '',
  'opening_hours_sv': '',
  'description_en': '',
  'description_fi': '<p>Nakertaja</p>',
  'description_sv': '',
  'occupied': false,
  'additional_details': ''
}
