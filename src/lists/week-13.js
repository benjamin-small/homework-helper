// Supplied “The Great Depression and the Dust Bowl, Spelling List: Week 13”.
// Answers are lowercase; Roosevelt keeps its capital in teaching text.
const words = [
  ['depression', 'A long period when business slows greatly and many people cannot find work.', ['depresion', 'deppression'], 'depre[ss]ion', ['s', 'sc'], 'De + pres + sion. Keep two s letters.', 'Many families lost income during the Great Depression.'],
  ['economy', 'The system of making, buying, and selling goods and services.', ['econemy', 'econnomy'], 'econ[o]my', ['e', 'a'], 'E + con + o + my. Remember o after n.', 'A factory closing can affect the local economy.'],
  ['unemployed', 'Without a paid job while available for and seeking work.', ['unemployd', 'unemployyed'], 'unemploy[e]d', ['a', 'i'], 'Un + employed. Keep the e before d.', 'The unemployed worker searched for a new job.'],
  ['mortgage', 'A loan used to buy property, such as a home, which the lender can take if the loan is not repaid.', ['morgage', 'mortgadge'], 'mor[t]gage', ['d', 'tt'], 'Remember the silent t in mort + gage.', 'They made a payment on their mortgage each month.'],
  ['poverty', 'The condition of not having enough money or resources for basic needs.', ['povertie', 'povertyy'], 'pov[er]ty', ['ar', 'or'], 'Pov + er + ty. Use er and finish with y.', 'The charity helped families living in poverty.'],
  ['hunger', 'The need or strong desire for food.', ['hungar', 'hungger'], 'hung[er]', ['ar', 'or'], 'Hung + er. The ending is er.', 'A warm meal eased her hunger.'],
  ['shelter', 'A place that protects people or animals from weather or danger.', ['sheltr', 'shelther'], 'she[l]ter', ['ll', 'r'], 'Shel + ter. Use one l before t.', 'The family found shelter from the storm.'],
  ['drought', 'A long period with little or no rain.', ['drougt', 'drowght'], 'drou[gh]t', ['g', 'h'], 'Drought has the silent letters gh before t.', 'The drought dried up the fields.'],
  ['desperate', 'Feeling that a situation is so serious that almost any action is worth trying.', ['desparate', 'desperete'], 'desp[e]rate', ['a', 'i'], 'Des + per + ate. Use e after p.', 'The stranded travelers were desperate to find water.'],
  ['devastation', 'Great damage or destruction.', ['devistation', 'devastaton'], 'dev[a]station', ['i', 'e'], 'Dev + a + sta + tion. Remember a after v.', 'The storm left devastation across the farmland.'],
  ['prairie', 'A large area of mostly flat grassland with few trees.', ['prarie', 'prairy'], 'pr[ai]rie', ['a', 'ay'], 'Prai + rie. Keep ai near the start and ie at the end.', 'Tall grasses grew across the prairie.'],
  ['farmer', 'A person who grows crops or raises animals for food or other products.', ['farmar', 'farmmer'], 'farm[er]', ['ar', 'or'], 'Farm + er. Use the ending er.', 'The farmer planted wheat in the field.'],
  ['livestock', 'Farm animals kept for food, work, or products such as wool.', ['livstock', 'livestok'], 'liv[e]stock', ['a', 'i'], 'Join live and stock. Keep the e.', 'The rancher brought the livestock fresh water.'],
  ['conservation', 'The careful protection and use of natural resources to prevent waste or damage.', ['conservasion', 'conservaton'], 'conserva[t]ion', ['s', 'sh'], 'Con + ser + va + tion. Finish with tion.', 'Soil conservation helps keep farmland healthy.'],
  ['erosion', 'The wearing away and movement of soil or rock by wind, water, or ice.', ['errosion', 'erozion'], 'ero[s]ion', ['z', 'ss'], 'E + ro + sion. Use one r and one s.', 'Plant roots can help prevent soil erosion.'],
  ['migrate', 'To move from one region or country to another to live, work, or follow the seasons.', ['migrat', 'migrait'], 'migr[a]te', ['ai', 'e'], 'Mi + grate. Use a and a silent final e.', 'Some families had to migrate to find work.'],
  ['hardship', 'A difficult condition that causes suffering or makes life hard.', ['hardshipp', 'hardshippe'], 'hard[sh]ip', ['s', 'ch'], 'Join hard and ship. Keep sh together.', 'Losing their crops caused great hardship for the family.'],
  ['relief', 'Help, such as food or money, given to people in need.', ['releif', 'relif'], 'rel[ie]f', ['ei', 'i'], 'Re + lief. Put i before e.', 'Volunteers brought relief to families after the flood.'],
  ['charity', 'The giving of help or resources to people in need, or an organization that provides that help.', ['charrity', 'charaty'], 'char[i]ty', ['a', 'e'], 'Char + i + ty. Use one r and an i before ty.', 'The charity collected coats for families.'],
  ['struggle', 'To try very hard to do something difficult.', ['strugle', 'struggel'], 'stru[gg]le', ['g', 'gh'], 'Strug + gle. Use two g letters and end with le.', 'Farmers struggle to grow crops without enough rain.'],
  ['survive', 'To stay alive or continue to exist through danger or difficulty.', ['surviv', 'servive'], 'surv[i]ve', ['e', 'a'], 'Sur + vive. Keep the i and silent final e.', 'Plants need water to survive.'],
  ['plains', 'Large areas of mostly flat land.', ['planes', 'plaiins'], 'pl[ai]ns', ['a', 'ay'], 'Use ai in plains. Do not confuse it with planes.', 'Strong winds swept across the plains.'],
  ['tractor', 'A powerful farm vehicle used to pull machinery and do heavy work.', ['tracter', 'tracktor'], 'tract[or]', ['er', 'ar'], 'Tract + or. End with or.', 'The tractor pulled a plow across the field.'],
  ['debt', 'Money that a person or organization owes.', ['det', 'debtt'], 'de[b]t', ['bb', 'p'], 'Keep the silent b before t.', 'She repaid the debt a little at a time.'],
  ['recovery', 'A return toward a healthier or more successful condition after a problem.', ['recovary', 'recovry'], 'recov[er]y', ['ar', 'or'], 'Re + cov + er + y. Remember er before y.', 'New jobs helped the town’s economic recovery.'],
  ['roosevelt', 'The family name of Franklin D. Roosevelt, the U.S. president who introduced the New Deal during the Great Depression.', ['rosevelt', 'rooseveldt'], 'r[oo]sevelt', ['o', 'ou'], 'Roose + velt. Keep two o letters and capitalize Roosevelt as a name.', 'Franklin D. Roosevelt introduced programs to help people during the Great Depression.', true],
].map(([word, definition, misspellings, pattern, gapDistractors, hint, sentence, bonus = false]) => ({
  word, definition, misspellings, pattern, gapDistractors, hint, sentence, bonus,
}));

// Keep closely related meanings from competing as answers to the same clue.
for (const word of ['prairie', 'plains', 'relief', 'charity']) {
  words.find(entry => entry.word === word).meaningDistractors = ['tractor', 'drought'];
}

export default {
  id: 'great-depression-and-dust-bowl-week-13',
  title: 'Week 13 · The Great Depression and the Dust Bowl',
  description: 'Economic hardship, life on the plains, and recovery.',
  words,
};
