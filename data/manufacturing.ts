export type ManufacturingService = {
  slug: string;
  name: string;
  headline: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  image: string;
  alt: string;
  designOnly?: boolean;
  options: { name: string; description: string }[];
  applications: string[];
  note: string;
};

// This catalogue drives routes, navigation, service copy and allowed enquiry options.
export const manufacturingServices: ManufacturingService[] = [
  {
    slug: '3d-printing',
    name: '3D Printing',
    seoTitle: '3D Printing & CAD Design in South Africa',
    seoDescription:
      'Custom 3D printing and CAD design in South Africa for prototypes, replacement parts, enclosures and components. Start with your model, sketch or idea.',
    headline: 'From an idea to a part you can hold.',
    description:
      'Custom 3D printing and CAD design for prototypes, replacement parts and product components. Bring a model, a sketch or simply a problem to solve.',
    image: '/images/engineers-prototype.jpg',
    alt: 'Engineers reviewing a physical prototype at a workbench',
    options: [
      {
        name: 'Design only',
        description:
          'Turn an idea, sketch, measurements or an existing component into an appropriate 3D model.',
      },
      {
        name: 'Printing only',
        description:
          'Already have a digital model? Send it for a review of printability, material and dimensions before production.',
      },
      {
        name: 'Design + Printing',
        description:
          'Work with us from the initial design through approval to your completed printed component.',
      },
    ],
    applications: [
      'Engineering prototypes',
      'Replacement parts',
      'Product enclosures',
      'Custom components',
      'Fixtures',
      'Small production components',
    ],
    note: 'Materials, dimensions, tolerances and suitability are reviewed for each project before we quote. No 3D model yet? We can design your part before printing it.',
  },
  {
    slug: 'laser-cutting',
    name: 'Laser Cutting',
    seoTitle: 'Laser Cutting & Design in South Africa',
    seoDescription:
      'Laser cutting and design support in South Africa for panels, profiles and custom components. Send your files or work with Tenacom to develop your design.',
    headline: 'Your geometry. Precisely considered.',
    description:
      'Laser cutting and design support for custom profiles and components. Start with suitable manufacturing files or let us prepare the design with you.',
    image: '/images/engineers-machine.jpg',
    alt: 'Engineers discussing equipment in a manufacturing workshop',
    options: [
      {
        name: 'Design only',
        description:
          'Prepare part geometry, drawings, layouts and manufacturing files for laser cutting.',
      },
      {
        name: 'Cutting only',
        description:
          'Send your existing files for a review of the material, thickness, dimensions and cutting requirements.',
      },
      {
        name: 'Design + Cutting',
        description:
          'Take your concept through design and approval to the completed cut component.',
      },
    ],
    applications: [
      'Panels',
      'Mounting plates',
      'Custom profiles',
      'Decorative components',
      'Product components',
      'Flat bracket blanks',
    ],
    note: 'Material and thickness compatibility, tolerances and quantities are confirmed before quoting. Cutting a flat profile does not include bending, welding or finishing unless separately agreed.',
  },
  {
    slug: 'sheet-metal-design',
    name: 'Sheet Metal & Manufacturing Design',
    seoTitle: 'Sheet Metal & Manufacturing CAD Design',
    seoDescription:
      'Sheet metal and manufacturing CAD design in South Africa. Get drawings and geometry for enclosures, brackets, panels and laser-cut parts from Tenacom.',
    headline: 'Designed with the next process in mind.',
    description:
      'CAD, drawings and geometry for parts intended for sheet-metal fabrication, laser cutting and other manufacturing processes. Clear design intent, ready for discussion with your manufacturer.',
    image: '/images/engineer-cad.jpg',
    alt: 'Engineer developing a component using CAD software',
    designOnly: true,
    options: [
      {
        name: 'Sheet-metal component',
        description:
          'Component and enclosure designs developed around the intended fabrication process.',
      },
      {
        name: 'Custom part',
        description: 'Translate a specific requirement into a considered component design.',
      },
      {
        name: 'Bracket',
        description: 'Define mounting geometry, interfaces and dimensions for your application.',
      },
      { name: 'Panel', description: 'Plan panel outlines, openings and mounting details.' },
      {
        name: 'Laser-cutting design',
        description: 'Prepare geometry and layouts for a laser-cut component.',
      },
      {
        name: 'Sticker / vinyl design',
        description: 'Prepare shapes and artwork for stickers, vinyl stickers and decals.',
      },
      {
        name: 'Product component',
        description: 'Develop a component around the wider product and its interfaces.',
      },
      {
        name: 'Other custom design',
        description: 'Discuss your idea and agree the drawings or files you need.',
      },
    ],
    applications: [
      'Sheet-metal enclosures',
      'Brackets & mounting plates',
      'Panels & custom shapes',
      'Laser-cut parts',
      'Product components',
      'Sticker, vinyl & decal artwork',
    ],
    note: 'This is a design service. Fabrication, bending, welding and sticker or vinyl production are not included. Manufacturing files and any fabrication-ready deliverables are agreed against the chosen process and manufacturer’s requirements.',
  },
];
export function findManufacturingService(slug: string) {
  return manufacturingServices.find((service) => service.slug === slug);
}
