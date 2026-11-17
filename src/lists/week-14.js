// Supplied “The New Deal, Spelling List: Week 14”.
const words = [
  ['reform', 'A change made to improve a law, system, or practice.', ['refrom', 'refform'], 're[f]orm', ['ff', 'ph'], 'Re + form. Use one f.', 'The new rule was a reform meant to make banking safer.'],
  ['federal', 'Relating to the national government rather than a state or local government.', ['fedral', 'federel'], 'fed[er]al', ['ar', 'or'], 'Fed + er + al. Keep er in the middle.', 'The federal government helped fund the new dam.'],
  ['government', 'The people and institutions that make and carry out the rules for a community, state, or country.', ['goverment', 'govornment'], 'gover[n]ment', ['m', 'nn'], 'Govern + ment. Keep the n before ment.', 'The government provides many public services.'],
  ['program', 'An organized plan of activities or services with a particular purpose.', ['progam', 'progrum'], 'prog[r]am', ['rr', 'w'], 'Pro + gram. Remember the second r.', 'The program offered meals to families in need.'],
  ['president', 'The elected head of the United States government.', ['presedent', 'presidant'], 'pres[i]dent', ['e', 'a'], 'Pres + i + dent. Use i after s.', 'Franklin D. Roosevelt became president in 1933.'],
  ['election', 'The process of choosing a person for a position by voting.', ['elektion', 'electon'], 'ele[c]tion', ['k', 's'], 'Elect + ion. Use c before t.', 'Voters chose a president in the election.'],
  ['administration', 'The group of officials who manage a government under a particular leader.', ['adminstration', 'administraton'], 'admin[i]stration', ['e', 'a'], 'Ad + min + i + stra + tion. Remember i after n.', 'The Roosevelt administration created New Deal programs.'],
  ['security', 'Protection from danger, harm, or serious uncertainty.', ['securaty', 'securty'], 'secur[i]ty', ['a', 'e'], 'Se + cur + i + ty. Keep i before ty.', 'A steady income gave the family a sense of security.'],
  ['insurance', 'An arrangement in which payments provide protection against certain losses or costs.', ['insurence', 'insurrance'], 'insur[a]nce', ['e', 'i'], 'Insur + ance. The ending is ance.', 'The family had insurance to help cover damage to their home.'],
  ['legislation', 'Laws made by a lawmaking body, or the process of making those laws.', ['legislaton', 'legislasion'], 'legisla[t]ion', ['s', 'sh'], 'Leg + is + la + tion. Finish with tion.', 'Congress passed legislation to create the new program.'],
  ['agency', 'An organization that carries out a particular service or task, often for a government.', ['agancy', 'agencie'], 'ag[e]ncy', ['a', 'i'], 'A + gen + cy. Use e after g and finish with y.', 'A government agency helped manage the building project.'],
  ['employment', 'The state of having paid work.', ['employmant', 'employmet'], 'employ[m]ent', ['n', 'mm'], 'Employ + ment. Keep the m in ment.', 'The construction project provided employment for many workers.'],
  ['project', 'A particular piece of planned work with a goal, such as building a bridge.', ['projet', 'progect'], 'pro[j]ect', ['g', 'jj'], 'Pro + ject. Use j after o.', 'The bridge project took two years to finish.'],
  ['construction', 'The work of building something, such as a road or a house.', ['constrution', 'constructon'], 'constru[c]tion', ['k', 's'], 'Construct + ion. Keep the c before t.', 'Construction began on a new school.'],
  ['electricity', 'A form of energy involving electric charges that can power lights and machines.', ['electrisity', 'electricty'], 'electri[c]ity', ['s', 'k'], 'Electric + ity. Keep both c letters.', 'Electricity made it possible to light the farmhouse at night.'],
  ['irrigation', 'Supplying water to land or crops through channels, pipes, or other methods.', ['irigation', 'irrigaton'], 'i[rr]igation', ['r', 're'], 'Ir + ri + ga + tion. Use two r letters.', 'Irrigation brought water to the dry fields.'],
  ['pension', 'Regular money paid to a person after retirement, often based on their past work.', ['pention', 'pensoin'], 'pen[s]ion', ['t', 'sh'], 'Pen + sion. Use s in the ending sion.', 'After years of work, she received a monthly pension.'],
  ['retirement', 'The stage of life when someone stops working at their regular career.', ['retirment', 'retiremant'], 'retir[e]ment', ['a', 'i'], 'Retire + ment. Keep the e before ment.', 'He spent more time gardening after retirement.'],
  ['benefits', 'Payments or services provided through a job or a public assistance program.', ['benifits', 'benefets'], 'ben[e]fits', ['i', 'a'], 'Ben + e + fits. Remember e after n.', 'The program offered benefits to workers who lost their jobs.'],
  ['optimism', 'The hope or belief that good things will happen.', ['optomism', 'optimisim'], 'opt[i]mism', ['o', 'e'], 'Op + ti + mism. Use i after t.', 'News of new jobs filled the town with optimism.'],
  ['confidence', 'A feeling of trust in someone or something, or belief in your own ability.', ['confidance', 'confidense'], 'confid[e]nce', ['a', 'i'], 'Con + fi + dence. The ending is ence.', 'The repaired bridge gave travelers confidence that they could cross safely.'],
  ['broadcast', 'To send a radio or television message to many people at once.', ['brodcast', 'broadcasst'], 'br[oa]dcast', ['o', 'ow'], 'Join broad and cast. Keep oa in broad.', 'The radio station planned to broadcast the president’s speech.'],
  ['campaign', 'An organized effort to reach a goal, such as winning an election.', ['campain', 'campagn'], 'campai[g]n', ['j', 'gg'], 'Cam + paign. Keep the silent g before n.', 'Volunteers helped with the candidate’s campaign.'],
  ['investment', 'Money or resources put into something with the hope of a future benefit or profit.', ['investmant', 'invesment'], 'inves[t]ment', ['d', 'tt'], 'Invest + ment. Keep the t before ment.', 'The town’s investment in a new water system helped its residents.'],
  ['bankrupt', 'Unable to pay debts and subject to a legal process for dealing with them.', ['bankrup', 'bancrupt'], 'ban[k]rupt', ['c', 'ck'], 'Join bank and rupt. Keep the k and the final t.', 'The business went bankrupt after it could no longer repay its debts.'],
  ['hydroelectric', 'Using the energy of moving water to produce electricity.', ['hydroeletric', 'hydroelectrik'], 'hydroele[c]tric', ['k', 's'], 'Hydro + electric. Keep the c before tr.', 'The hydroelectric dam used flowing water to generate power.', true],
].map(([word, definition, misspellings, pattern, gapDistractors, hint, sentence, bonus = false]) => ({
  word, definition, misspellings, pattern, gapDistractors, hint, sentence, bonus,
}));

// Closely related government and assistance terms should not compete as answers.
for (const word of ['government', 'administration', 'agency', 'program', 'project', 'pension', 'benefits', 'insurance', 'security', 'optimism', 'confidence']) {
  words.find(entry => entry.word === word).meaningDistractors = ['irrigation', 'broadcast'];
}

export default {
  id: 'new-deal-week-14',
  title: 'Week 14 · The New Deal',
  description: 'Public programs, jobs, and hope during the New Deal.',
  words,
};
