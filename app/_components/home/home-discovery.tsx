import { ArrowRight } from 'lucide-react';

const discoveryLinks = [
  'For breakfast',
  'Something for every day',
  'For a celebration',
  'Prepare ahead',
  'I just want to bake',
];

export function HomeDiscovery() {
  return (
    <section className="discovery" aria-labelledby="discovery-title">
      <div className="section-kicker">
        <span>01</span>
        <p id="discovery-title">Choose by the moment</p>
      </div>
      <div className="discovery-links">
        {discoveryLinks.map((link) => (
          <a key={link} href="#recipes">{link}<ArrowRight aria-hidden="true" size={17} /></a>
        ))}
      </div>
    </section>
  );
}
