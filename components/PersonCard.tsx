import type {Person} from '@/content/people';

/* Arched initials badge, name and role. The badge is decorative - the name
   is already the accessible text. Portraits replace the initials when EFDA
   supplies them. */
export function PersonCard({person, role}: {person: Person; role: string}) {
  return (
    <article className="person">
      <div
        className={['person__badge', person.badge ? `person__badge--${person.badge}` : null]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      >
        {person.initials}
      </div>
      <div>
        <h3 lang="en">{person.name}</h3>
        <p>{role}</p>
      </div>
    </article>
  );
}
