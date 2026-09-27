export const navigation = [
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
    description:
      'The physical architecture that makes technology reliable. From a first CAD model to a tested, integrated assembly.',
    items: [
      'Mechanical design & CAD',
      'Enclosures, mounting & fixtures',
      'Rapid prototyping & physical validation',
      'Electromechanical integration',
      'Manufacturing support & documentation',
    ],
    icon: 'box',
  },
  {
    title: 'Embedded & connected systems',
    short: 'Give your equipment a voice.',
    description:
      'Sensing, embedded software and communication that connect equipment to the information you need.',
    items: [
      'Sensor & controller integration',
      'Embedded software & control logic',
      'Device-to-cloud communication',
      'Gateways & legacy equipment connectivity',
      'Device configuration & field integration',
    ],
    icon: 'radio',
  },
  {
    title: 'Software platforms',
    short: 'A clear view of your operation.',
    description:
      'Purpose-built software that helps people understand, manage and control connected operations.',
    items: [
      'Operational interfaces & dashboards',
      'Backend systems, APIs & databases',
      'Cloud infrastructure & device management',
      'Real-time monitoring & reporting',
      'Integration with business systems',
    ],
    icon: 'layers',
  },
  {
    title: 'Automation & intelligence',
    short: 'From information to action.',
    description:
      'Turn operational data into useful alerts, better decisions and controlled physical responses.',
    items: [
      'Rules, alerts & automated workflows',
      'Remote commands & control',
      'Operational analytics',
      'Anomaly detection',
      'Machine learning where it adds practical value',
    ],
    icon: 'activity',
  },
] as const;
export const solutions = [
  {
    title: 'Machine condition monitoring',
    category: 'Equipment visibility',
    description:
      'Track vibration, temperature and running state to spot changes before they become surprises.',
    signals: 'Vibration · Temperature · Runtime',
    outcome: 'Give maintenance teams context for investigation and planning.',
  },
  {
    title: 'Smart pump monitoring',
    category: 'Connected infrastructure',
    description:
      'Bring flow, pressure and operating status together in one view, with alerts and appropriate remote control.',
    signals: 'Flow · Pressure · Motor state',
    outcome: 'Understand pump behaviour without relying only on manual inspection.',
  },
  {
    title: 'Environmental monitoring',
    category: 'Remote sensing',
    description:
      'Measure conditions across buildings, field locations and sensitive storage environments.',
    signals: 'Temperature · Humidity · Water quality',
    outcome: 'Make changing conditions visible to the people who can respond.',
  },
  {
    title: 'Tank & resource monitoring',
    category: 'Operational insight',
    description:
      'Track levels, consumption and thresholds across distributed tanks and facilities.',
    signals: 'Level · Consumption · Thresholds',
    outcome: 'Plan replenishment and investigate unexpected changes.',
  },
  {
    title: 'Connected products',
    category: 'Product development',
    description:
      'Engineer the enclosure, embedded behaviour and software experience as one coherent product.',
    signals: 'Physical design · Connectivity · Software',
    outcome: 'Move from an idea to an integrated prototype you can test.',
  },
  {
    title: 'Custom automation',
    category: 'Intelligent control',
    description:
      'Connect measured conditions to defined rules, software workflows and physical responses.',
    signals: 'Inputs · Rules · Actuation',
    outcome: 'Reduce repetitive intervention with control suited to the operating environment.',
  },
  {
    title: 'Cold chain monitoring',
    category: 'Condition tracking',
    description:
      'Capture storage and transport conditions, with clear records and threshold alerts.',
    signals: 'Temperature · Humidity · Time',
    outcome: 'Identify excursions and support informed handling decisions.',
  },
  {
    title: 'Energy monitoring',
    category: 'Resource visibility',
    description:
      'Collect consumption data from equipment and facilities to understand when and where energy is used.',
    signals: 'Power · Energy · Operating state',
    outcome: 'Make consumption patterns available for operational decisions.',
  },
  {
    title: 'Remote asset monitoring',
    category: 'Distributed operations',
    description:
      'Bring the condition and status of dispersed equipment into a shared operational interface.',
    signals: 'Status · Location context · Alerts',
    outcome: 'Prioritise site visits using current information.',
  },
] as const;
export const industries = [
  ['Manufacturing', 'Equipment visibility, process data and connected production systems.'],
  ['Mining', 'Remote equipment monitoring and operational data in demanding environments.'],
  ['Agriculture', 'Water, environmental conditions and distributed field infrastructure.'],
  ['Energy', 'Asset status, consumption data and maintenance visibility.'],
  ['Logistics & cold storage', 'Storage conditions, handling processes and connected assets.'],
  ['Water & infrastructure', 'Pumps, tanks, flow and distributed equipment.'],
  ['Commercial property', 'Building systems, resource monitoring and facilities automation.'],
  [
    'Engineering & technology',
    'Prototypes, connected products and integrated physical-digital systems.',
  ],
] as const;
export const process = [
  ['Understand', 'Start with the operational problem, the people and the environment.'],
  ['Engineer', 'Define the physical, sensing, control and software requirements together.'],
  ['Prototype', 'Build the smallest useful system that can prove the concept.'],
  ['Test', 'Validate fit, behaviour and performance under real operating conditions.'],
  ['Deploy', 'Integrate the system into the operation with clear documentation.'],
  ['Improve', 'Use field feedback and measured data to refine the system.'],
] as const;
