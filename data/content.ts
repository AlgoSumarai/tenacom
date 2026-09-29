export const navigation = [
  ['Manufacturing', '/manufacturing'],
  ['Capabilities', '/capabilities'],
  ['Solutions', '/solutions'],
  ['Industries', '/industries'],
  ['How we work', '/#process'],
  ['About', '/about'],
] as const;
export const capabilities = [
  {
    title: 'Mechanical & product engineering',
    short: 'Built for the physical world.',
    description: 'Design and validate the physical architecture around the technology.',
    items: [
      'Mechanical design & CAD',
      'Rapid prototyping & physical validation',
      'Electromechanical integration & manufacturing support',
    ],
    icon: 'box',
  },
  {
    title: 'Embedded & connected systems',
    short: 'Give your equipment a voice.',
    description: 'Connect sensors, controllers and equipment to the information you need.',
    items: [
      'Sensor & controller integration',
      'Embedded software & control',
      'Device, gateway & legacy connectivity',
    ],
    icon: 'radio',
  },
  {
    title: 'Software platforms',
    short: 'A clear view of your operation.',
    description: 'Purpose-built software for understanding and managing connected operations.',
    items: [
      'Operational applications & dashboards',
      'Backend systems, APIs & data',
      'Cloud, device & business-system integration',
    ],
    icon: 'layers',
  },
  {
    title: 'Automation & intelligence',
    short: 'From information to action.',
    description: 'Turn operational data into alerts, decisions and controlled responses.',
    items: [
      'Rules, alerts & automated workflows',
      'Remote commands & control',
      'Operational analytics & anomaly detection',
    ],
    icon: 'activity',
  },
] as const;
export const solutions = [
  {
    title: 'Machine condition monitoring',
    category: 'Equipment visibility',
    description:
      'Track vibration, temperature and runtime so maintenance teams can investigate changes earlier.',
    signals: 'Vibration · Temperature · Runtime',
  },
  {
    title: 'Smart pump monitoring',
    category: 'Connected infrastructure',
    description: 'Bring flow, pressure and motor state into one clear view for faster response.',
    signals: 'Flow · Pressure · Motor state',
  },
  {
    title: 'Environmental monitoring',
    category: 'Remote sensing',
    description: 'Monitor changing conditions across buildings, field sites and sensitive storage.',
    signals: 'Temperature · Humidity · Water quality',
  },
  {
    title: 'Connected products',
    category: 'Product development',
    description: 'Develop the enclosure, embedded behaviour and software as one testable product.',
    signals: 'Physical design · Connectivity · Software',
  },
  {
    title: 'Custom automation',
    category: 'Intelligent control',
    description: 'Link measured conditions to rules, workflows and physical responses.',
    signals: 'Inputs · Rules · Actuation',
  },
  {
    title: 'Remote asset monitoring',
    category: 'Distributed operations',
    description:
      'See distributed equipment condition and prioritise site visits with current data.',
    signals: 'Status · Location context · Alerts',
  },
] as const;
export const industries = [
  ['Manufacturing', 'Connected equipment, production data and process visibility.'],
  ['Mining', 'Remote asset visibility for demanding environments.'],
  ['Agriculture', 'Water, environmental and field infrastructure monitoring.'],
  ['Energy', 'Asset condition, consumption and maintenance data.'],
  ['Logistics & cold storage', 'Condition tracking across storage and handling.'],
  ['Water & infrastructure', 'Pumps, tanks, flow and distributed assets.'],
  ['Commercial property', 'Building systems and resource monitoring.'],
  ['Engineering & technology', 'Connected products and integrated prototypes.'],
] as const;
export const process = [
  ['Understand', 'Define the problem, the people and the operating environment.'],
  ['Engineer', 'Design the physical, connected and software system together.'],
  ['Prove', 'Build and test the smallest useful working system.'],
  ['Deploy', 'Integrate it with clear documentation and a path to improve.'],
] as const;
