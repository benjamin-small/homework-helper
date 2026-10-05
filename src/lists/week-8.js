// Supplied “Number the Stars — Spelling List, Week 8”.
// Definitions, hints, and example sentences are original practice material.
const words = [
  ['occupation', 'Control of a country or area by a foreign army.', ['ocupation', 'occupaition'], 'o[cc]upation', ['c', 'ck'], 'Double the c: oc + cu + pa + tion.', 'During the occupation, a foreign army controlled the town.'],
  ['resistance', 'Efforts to oppose or fight against someone in control.', ['resistence', 'resistense'], 'resist[a]nce', ['e', 'i'], 'Resist + ance. The ending is -ance, with an a.', 'The resistance worked together to oppose the occupying army.'],
  ['refugee', 'A person forced to leave home to find safety from war, danger, or unfair treatment.', ['refugie', 'refuge'], 'refug[ee]', ['ie', 'e'], 'Refuge + e. Remember the two e letters at the end.', 'The refugee crossed the border to find a safe place to live.'],
  ['soldier', 'A person who serves in an army.', ['soldeir', 'solder'], 'sold[ie]r', ['ei', 'e'], 'Sold + ier. The i comes before the e.', 'The soldier stood beside the gate.'],
  ['uniform', 'A set of clothes worn by members of the same group.', ['unifrom', 'unaform'], 'unif[or]m', ['ro', 'er'], 'Uni + form. Keep the letters in form in order.', 'Each member of the team wore the same uniform.'],
  ['curfew', 'A rule that people must stay indoors after a certain time.', ['curfue', 'kerfew'], 'curf[ew]', ['ue', 'oo'], 'Cur + few. The ending is spelled like the word few.', 'Everyone had to be home before curfew.'],
  ['rescue', 'To save someone or something from danger.', ['resque', 'rescu'], 'res[c]ue', ['q', 'k'], 'Res + cue. Use c before the u, and keep the final e.', 'The crew used a boat to rescue the stranded family.'],
  ['courage', 'The strength to face fear or difficulty.', ['corage', 'courige'], 'c[ou]rage', ['o', 'oo'], 'Remember ou after c, then add rage.', 'It took courage to ask for help when she was afraid.'],
  ['danger', 'The possibility that someone or something could be harmed.', ['danjer', 'dangor'], 'dan[g]er', ['j', 'gg'], 'The g makes a j sound. The ending is -ger.', 'The sign warned hikers of danger near the cliff.'],
  ['disguise', 'Something that changes how a person looks so others will not recognize them.', ['disgise', 'disguize'], 'disg[ui]se', ['i', 'ue'], 'Dis + guise. Remember the silent u before i.', 'A hat and a false mustache made a good disguise.'],
  ['betrayal', 'An act of breaking someone’s trust or helping their enemy.', ['betrayel', 'betrail'], 'betray[a]l', ['e', 'i'], 'Betray + al. Keep the y and add -al.', 'Sharing her friend’s secret was a betrayal of trust.'],
  ['loyalty', 'Faithful support for someone or something.', ['loyalaty', 'loyality'], 'loyal[t]y', ['at', 'it'], 'Loyal + ty. Do not add another vowel before the t.', 'He showed loyalty by standing beside his friend.'],
  ['friendship', 'A caring relationship between friends.', ['freindship', 'frendship'], 'fr[ie]ndship', ['ei', 'e'], 'Friend + ship. In friend, i comes before e.', 'Their friendship grew as they helped each other.'],
  ['journey', 'A trip from one place to another.', ['journy', 'jorney'], 'journ[e]y', ['a', 'i'], 'Keep the e before the final y: jour + ney.', 'Their journey took them across the sea.'],
  ['escape', 'To get away from danger or a place where someone is being held.', ['escap', 'exscape'], 'escap[e]', ['a', 'i'], 'Start with es, and keep the silent e at the end.', 'The open gate helped the horse escape from the field.'],
  ['secret', 'Something kept hidden or known by only a few people.', ['secrit', 'secreat'], 'secr[e]t', ['i', 'ea'], 'Se + cret. Both vowels are e.', 'They kept the surprise party a secret.'],
  ['suspicious', 'Feeling that someone or something may be wrong or dishonest.', ['suspicous', 'suspishous'], 'suspi[ci]ous', ['c', 'sh'], 'Sus + pi + cious. The ending -cious sounds like shus.', 'She felt suspicious when the stranger gave two different names.'],
  ['protect', 'To keep someone or something safe from harm.', ['protec', 'proteckt'], 'prote[c]t', ['k', 'ck'], 'Pro + tect. End with ct, without a k.', 'A helmet helps protect your head.'],
  ['sacrifice', 'To give up something valuable to help someone or achieve something important.', ['sacrafice', 'sacrifise'], 'sacr[i]fice', ['a', 'e'], 'Sac + ri + fice. Use i after the r.', 'She chose to sacrifice her free time to help a friend.'],
  ['truth', 'What is real or what actually happened.', ['trueth', 'trooth'], 'tr[u]th', ['ue', 'oo'], 'True loses its e before th: truth.', 'He told the truth about the broken cup.'],
  ['deceive', 'To make someone believe something that is not true.', ['decieve', 'deceve'], 'dec[ei]ve', ['ie', 'e'], 'In deceive, e comes before i after the c.', 'The trick was meant to deceive the audience.'],
  ['neighbor', 'A person who lives near you.', ['nieghbor', 'neibor'], 'n[ei]ghbor', ['ie', 'ay'], 'Remember ei followed by silent gh: neigh + bor.', 'Our neighbor lives in the house next door.'],
  ['bravery', 'The quality of acting courageously even when afraid.', ['bravary', 'bravry'], 'brav[e]ry', ['a', 'i'], 'Brave + ry. Keep the e from brave.', 'The firefighter showed bravery during the rescue.'],
  ['hardship', 'A difficult situation that causes suffering or makes life hard.', ['hardshipp', 'hardchip'], 'hard[sh]ip', ['ch', 's'], 'Join hard and ship. The ending has one p.', 'The family faced hardship when the storm damaged their home.'],
  ['freedom', 'The ability or right to live and make choices without being unfairly controlled.', ['freedum', 'fredom'], 'freed[o]m', ['u', 'a'], 'Free + dom. Remember two e letters and an o.', 'The birds flew to freedom when the cage opened.'],
  ['annihilate', 'To destroy something completely.', ['anihilate', 'annialate'], 'a[nn]ihilate', ['n', 'nh'], 'Use two n letters and remember the h: an + ni + hi + late.', 'The powerful storm could annihilate the small sandcastle.', true],
].map(([word, definition, misspellings, pattern, gapDistractors, hint, sentence, bonus = false]) => ({
  word, definition, misspellings, pattern, gapDistractors, hint, sentence, bonus,
}));

// These words are close synonyms; never make the learner choose between them.
for (const word of ['courage', 'bravery']) {
  words.find(entry => entry.word === word).meaningDistractors = ['curfew', 'betrayal'];
}

export default {
  id: 'number-the-stars-week-8',
  title: 'Week 8 · Number the Stars',
  description: 'Courage, friendship, and finding safety.',
  words,
};
