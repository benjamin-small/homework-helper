// Supplied “The Roaring Twenties: Spelling List 11”. All 26 entries are numbered.
// Definitions, hints, and example sentences are original practice material.
const words = [
  ['automobile', 'A motor vehicle with wheels used to carry people on roads.', ['automoble', 'automobille'], 'automob[i]le', ['e', 'a'], 'Auto + mobile. Keep the i before le.', 'More families traveled by automobile during the 1920s.'],
  ['assembly', 'The process of putting parts together to make something.', ['asembly', 'assembely'], 'a[ss]embly', ['s', 'sc'], 'Use two s letters and end with bly.', 'An assembly line helped workers build cars more quickly.'],
  ['radio', 'A device that receives signals and plays broadcasts of speech or music.', ['radeo', 'raido'], 'rad[io]', ['eo', 'oi'], 'Rad + io. Put i before o.', 'The family gathered around the radio to hear the news.'],
  ['jazz', 'A style of music known for lively rhythms and performers inventing parts as they play.', ['jaz', 'jass'], 'ja[zz]', ['z', 'ss'], 'End with two z letters.', 'The band played jazz for the dancers.'],
  ['flapper', 'A young woman in the 1920s known for modern fashions and challenging traditional expectations.', ['flaper', 'flappor'], 'fla[pp]er', ['p', 'pe'], 'Use two p letters before er.', 'The museum displayed a dress worn by a flapper in the 1920s.'],
  ['prohibition', 'An official ban on something, especially the former United States ban on making and selling alcoholic drinks.', ['prohibiton', 'prohabition'], 'proh[i]bition', ['a', 'e'], 'Pro + hi + bi + tion. Remember i after h.', 'During Prohibition, selling alcoholic drinks was illegal in the United States.'],
  ['speakeasy', 'A place that secretly sold alcoholic drinks when selling them was illegal.', ['speekeasy', 'speakeazy'], 'sp[ea]keasy', ['ee', 'ie'], 'Join speak and easy as one word, keeping both ea pairs.', 'The history exhibit showed the hidden entrance to a speakeasy.'],
  ['skyscraper', 'A very tall building with many floors.', ['skyscaper', 'skyscrapper'], 'skyscr[a]per', ['ai', 'e'], 'Join sky and scraper, keeping the a in scraper.', 'A new skyscraper rose above the city streets.'],
  ['prosperity', 'A condition in which people or businesses are doing well and have enough money or resources.', ['prosparity', 'prosperety'], 'prosp[er]ity', ['ar', 'or'], 'Pros + per + i + ty. Remember er after prosp.', 'New businesses brought prosperity to the town.'],
  ['entertainment', 'Activities or performances that people enjoy watching, hearing, or doing.', ['entertanment', 'entertainmant'], 'entert[ai]nment', ['a', 'ia'], 'Entertain + ment. Keep ai in entertain.', 'Movies became a popular form of entertainment.'],
  ['celebrity', 'A person who is well known to many people, often through entertainment or sports.', ['celebritty', 'celebrety'], 'celebr[i]ty', ['e', 'a'], 'Ce + leb + ri + ty. Use i before ty.', 'The famous actor became a celebrity.'],
  ['amendment', 'A change or addition to a document, such as a constitution or law.', ['ammendment', 'amendmant'], 'a[m]endment', ['mm', 'n'], 'Amend + ment. Use one m after the first a.', 'The class studied an amendment to the Constitution.'],
  ['suffrage', 'The right to vote in political elections.', ['sufrage', 'suffrige'], 'su[ff]rage', ['f', 'ph'], 'Use two f letters, then rage.', 'People marched to demand equal suffrage.'],
  ['migration', 'The movement of people or animals from one region to another.', ['migratoin', 'migretion'], 'migr[a]tion', ['e', 'ai'], 'Mi + gra + tion. Remember a before tion.', 'The Great Migration brought many Black Americans from the South to northern and western cities.'],
  ['fashion', 'A style of clothing or appearance that is popular at a particular time.', ['fashon', 'fassion'], 'fash[i]on', ['e', 'y'], 'Fash + ion. Keep i before o.', 'Clothing fashion changed during the 1920s.'],
  ['aviation', 'The activity of flying aircraft, including designing and operating them.', ['avaition', 'aviatoin'], 'av[ia]tion', ['ai', 'ea'], 'A + vi + a + tion. Keep i before a.', 'Long flights across oceans helped advance aviation.'],
  ['invention', 'Something new that someone designs or creates.', ['inventoin', 'invenshun'], 'inven[ti]on', ['si', 'sh'], 'Invent + ion. The ending is tion.', 'The new invention made everyday work easier.'],
  ['consumer', 'A person who buys or uses goods and services.', ['consummer', 'consumor'], 'consum[e]r', ['o', 'a'], 'Con + sum + er. End with er.', 'A consumer compared prices before buying a radio.'],
  ['advertisement', 'A message meant to persuade people to buy or try something.', ['advertisment', 'advertizement'], 'advertis[e]ment', ['a', 'i'], 'Advertise + ment. Keep the e before ment.', 'A newspaper advertisement showed a new automobile.'],
  ['credit', 'An arrangement that lets someone receive goods or money now and pay later.', ['creddit', 'credet'], 'cred[i]t', ['e', 'a'], 'Cred + it. Use one d and an i before t.', 'The store allowed customers to buy on credit and pay later.'],
  ['stock', 'A share of ownership in a company that can be bought or sold.', ['stok', 'stoc'], 'sto[ck]', ['k', 'c'], 'End with ck.', 'She bought stock and became a part owner of the company.'],
  ['market', 'A place or system where people buy and sell goods or investments.', ['markit', 'markett'], 'mark[e]t', ['i', 'a'], 'Mar + ket. Use e before the final t.', 'People bought and sold company shares in the stock market.'],
  ['crash', 'A sudden, large drop in the value of something, such as stocks.', ['crassh', 'crasch'], 'cra[sh]', ['ss', 'sch'], 'End with sh.', 'The stock market crash caused many investments to lose value.'],
  ['decade', 'A period of ten years.', ['decaid', 'deccade'], 'dec[a]de', ['ai', 'e'], 'Dec + ade. Use a and end with a silent e.', 'The 1920s were a decade of many changes.'],
  ['culture', 'The shared customs, arts, beliefs, and ways of life of a group of people.', ['culter', 'cultchure'], 'cul[tu]re', ['chu', 'te'], 'Cul + ture. The ending is ture.', 'Music and art are important parts of culture.'],
  ['renaissance', 'A revival or new period of growth in art, literature, or learning.', ['renaisance', 'rennaissance'], 'renai[ss]ance', ['s', 'sc'], 'Re + nais + sance. Use two s letters and end with ance.', 'The Harlem Renaissance was a time of flourishing Black art, music, and writing.'],
].map(([word, definition, misspellings, pattern, gapDistractors, hint, sentence]) => ({
  word, definition, misspellings, pattern, gapDistractors, hint, sentence, bonus: false,
}));

export default {
  id: 'roaring-twenties-week-11',
  title: 'Week 11 · The Roaring Twenties',
  description: 'New inventions, music, culture, and economic change in the 1920s.',
  words,
};
