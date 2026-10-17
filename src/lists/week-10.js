// Supplied “World War I, Spelling List: Week 10”.
// Definitions, hints, and example sentences are original practice material.
const words = [
  ['alliance', 'An agreement between countries or groups to help one another.', ['aliance', 'allience'], 'a[ll]iance', ['l', 'li'], 'Use two l letters, then iance.', 'The countries formed an alliance to help one another.'],
  ['assassination', 'The planned killing of an important person, often for political reasons.', ['assasination', 'assassinatoin'], 'assa[ss]ination', ['s', 'sc'], 'Remember two pairs of s letters: as + sas + si + nation.', 'The assassination of the archduke helped set off a series of events leading to war.'],
  ['battle', 'A fight between armed forces during a war.', ['batle', 'battel'], 'ba[tt]le', ['t', 'tl'], 'Use two t letters and end with le.', 'The museum map showed where the battle took place.'],
  ['nationalism', 'Strong loyalty to a nation, sometimes including the belief that it is better than others.', ['nationlism', 'nationalizm'], 'nationali[s]m', ['z', 'ss'], 'Nation + al + ism. The ending is ism.', 'Nationalism influenced how many people thought about their country.'],
  ['invade', 'To enter another country or area with an armed force to take control.', ['invaid', 'invadde'], 'inv[a]de', ['ai', 'e'], 'In + vade. Use a and a final silent e.', 'The army planned to invade the neighboring country.'],
  ['archduke', 'A title once used by certain princes in the Austrian royal family.', ['archduck', 'archduik'], 'archd[u]ke', ['ui', 'oo'], 'Join arch and duke, keeping the final e.', 'Archduke Franz Ferdinand was a member of the Austrian royal family.'],
  ['empire', 'A group of lands or peoples ruled by one powerful ruler or government.', ['empier', 'empirre'], 'emp[ir]e', ['ri', 'er'], 'Em + pire. Keep i before r and end with e.', 'The empire included lands with many different languages.'],
  ['mobilize', 'To prepare and organize people or supplies for action, especially for war.', ['mobillize', 'mobolize'], 'mobil[i]ze', ['o', 'a'], 'Mo + bi + lize. This list uses the American ending ize.', 'The government began to mobilize its armed forces.'],
  ['neutral', 'Not supporting either side in a conflict.', ['nuetral', 'neutrel'], 'n[eu]tral', ['ue', 'oo'], 'Use e before u, then add tral.', 'The country chose to remain neutral during the war.'],
  ['declaration', 'An official or public statement announcing something.', ['declaratoin', 'decleration'], 'decl[a]ration', ['e', 'i'], 'Dec + la + ra + tion. Remember the a after l.', 'The leader read a declaration of peace.'],
  ['conflict', 'A serious disagreement or struggle between people or groups.', ['conflikt', 'confict'], 'confli[c]t', ['k', 'ck'], 'Con + flict. Use c before the final t.', 'The two sides tried to settle the conflict through talks.'],
  ['trench', 'A long, narrow ditch dug in the ground, often used to protect soldiers.', ['trensh', 'trentch'], 'tren[ch]', ['sh', 'tch'], 'End with ch, without an extra t.', 'The soldiers sheltered in a trench.'],
  ['artillery', 'Large guns used by armed forces, or the soldiers who operate them.', ['artilery', 'artillary'], 'arti[ll]ery', ['l', 'li'], 'Ar + til + ler + y. Use two l letters.', 'The museum displayed artillery used during the war.'],
  ['submarine', 'A vessel that can travel and operate underwater.', ['submareen', 'submarin'], 'submar[i]ne', ['ee', 'e'], 'Sub + marine. Use i and a final e.', 'The submarine traveled beneath the surface of the sea.'],
  ['propaganda', 'Messages designed to influence beliefs, often by presenting only one side or misleading information.', ['propoganda', 'propagandda'], 'prop[a]ganda', ['o', 'e'], 'Prop + a + gan + da. Remember a after prop.', 'The class studied a propaganda poster from the war.'],
  ['casualty', 'A person killed or injured in a war or accident.', ['casulty', 'casuality'], 'casu[a]lty', ['i', 'e'], 'Cas + u + al + ty. There is no extra i before ty.', 'The report counted each injured soldier as a casualty.'],
  ['draft', 'A system that requires selected people to serve in the armed forces.', ['drafft', 'drafte'], 'dra[f]t', ['ff', 'ph'], 'Use one f between a and t.', 'The draft required some adults to join the armed forces.'],
  ['rationing', 'Limiting how much of a scarce supply each person may have.', ['rationning', 'rashoning'], 'ratio[n]ing', ['nn', 'm'], 'Ration + ing. Keep just one n before ing.', 'Rationing helped families share limited food supplies.'],
  ['treaty', 'A formal agreement between countries.', ['treety', 'treatie'], 'tr[ea]ty', ['ee', 'ie'], 'Treat + y. Use ea and end with y.', 'The countries signed a treaty after the war.'],
  ['airplane', 'A powered flying vehicle with fixed wings.', ['airplain', 'aerplane'], 'airpl[a]ne', ['ai', 'e'], 'Join air and plane, keeping the final e.', 'An airplane flew above the fields.'],
  ['surrender', 'To stop fighting and give in to an opposing side.', ['surender', 'surrendar'], 'su[rr]ender', ['r', 're'], 'Sur + ren + der. Use two r letters together.', 'The commander decided to surrender to end the fighting.'],
  ['victory', 'Success in winning a battle, contest, or struggle.', ['victorry', 'victorey'], 'victo[r]y', ['rr', 're'], 'Vic + tor + y. Use one r and end with y.', 'The team celebrated its victory.'],
  ['veteran', 'A person who has served in the armed forces.', ['vetaran', 'vetern'], 'vet[e]ran', ['a', 'i'], 'Vet + er + an. Remember e after the t.', 'A veteran visited the class to share memories of military service.'],
  ['consequence', 'A result of an action or event.', ['consequense', 'consiquence'], 'consequen[c]e', ['s', 'se'], 'Con + se + quence. Use c in the ending ce.', 'A shortage of food was one consequence of the war.'],
  ['peace', 'A state without war or fighting.', ['peece', 'pease'], 'p[ea]ce', ['ee', 'ie'], 'Use ea for the vowel sound and end with ce.', 'The people hoped for lasting peace.'],
  ['survivor', 'A person who stays alive through a dangerous event or difficult situation.', ['surviver', 'survivour'], 'surviv[o]r', ['e', 'ou'], 'Survive becomes survivor: drop the final e and add or.', 'The survivor shared a story of hope after the disaster.', true],
].map(([word, definition, misspellings, pattern, gapDistractors, hint, sentence, bonus = false]) => ({
  word, definition, misspellings, pattern, gapDistractors, hint, sentence, bonus,
}));

export default {
  id: 'world-war-i-week-10',
  title: 'Week 10 · World War I',
  description: 'Countries, conflict, and the search for peace during World War I.',
  words,
};
