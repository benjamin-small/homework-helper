// Transcribed from the supplied printed Week 7 list. Teaching material is original.
const words = [
  ["industry","A kind of business that makes goods or provides services.",["industery","industrey"],"ind[ust]ry",["est","ist"],"The ending is -stry. There is no extra e.","The steel industry made metal for bridges."],
  ["factory","A building where workers and machines make things.",["factery","factorey"],"fact[o]ry",["a","e"],"Think fact + ory. The middle vowel is o.","The factory makes shoes."],
  ["machine","A tool with moving parts that helps people do work.",["mashine","macheen"],"ma[chi]ne",["shi","chee"],"The ch sounds like sh. Remember the final e.","A machine helps cut the wood."],
  ["invention","A new thing or way of doing something that someone creates.",["envention","inventoin"],"[in]vention",["en","un"],"Start with in, then add vention.","The light bulb was an important invention."],
  ["railroad","A track made of metal rails that trains travel on.",["railrode","ralroad"],"r[ai]lroad",["a","ay"],"Put two familiar words together: rail + road.","The railroad connects the two towns."],
  ["telegraph","An old system that sent messages over wires using electrical signals.",["telagraph","telegraf"],"tel[e]graph",["a","i"],"Tele + graph. Graph ends in ph.","The operator sent a message by telegraph."],
  ["locomotive","The engine that pulls or pushes a train.",["locomotiv","locamotive"],"locomotiv[e]",["a","i"],"Loco + motive. Keep the silent e at the end.","The locomotive pulled ten train cars."],
  ["textile","Cloth or fabric made by weaving or knitting threads.",["textil","textial"],"text[ile]",["il","ial"],"Text + ile. The word ends with a silent e.","Cotton cloth is a textile."],
  ["manufacture","To make goods, often in large amounts with machines.",["manufacter","manufature"],"manufa[ct]ure",["t","ckt"],"Manu + facture. Keep the c before the t.","The company will manufacture bicycles."],
  ["production","The process of making or growing goods.",["prodution","producktion"],"produ[c]tion",["k","ck"],"Product + ion. There is a c, but no k.","The new equipment increased production."],
  ["transportation","The movement of people or goods from one place to another.",["transportaion","transportasion"],"transporta[ti]on",["si","ci"],"Transport + ation. The ending is -tion.","Trains are a form of transportation."],
  ["urbanization","The growth of towns and cities as more people move into them.",["urbanazation","urbaniation"],"urban[i]zation",["a","e"],"Urban + ization. Use i after urban.","Urbanization brought more families into cities."],
  ["immigrant","A person who moves to another country to live there.",["imigrant","immagrint"],"i[mm]igrant",["m","mn"],"Remember two m letters: im + migrant.","The immigrant made a home in a new country."],
  ["laborer","A person who does physical work.",["laberer","laboror"],"lab[o]rer",["a","e"],"Labor + er. The last part is -er.","The laborer helped build the road."],
  ["resource","Something useful that people can use to meet a need.",["resorce","resourse"],"res[ou]rce",["o","oo"],"Re + source. Remember ou and the c.","Water is an important natural resource."],
  ["technology","Tools and knowledge used to solve problems and do things.",["tecnology","technolagy"],"te[ch]nology",["c","sh"],"Tech + nology. The ch makes a k sound.","New technology helped people work faster."],
  ["efficiency","Doing a job well without wasting time, energy, or materials.",["eficiency","efficency"],"effic[ie]ncy",["e","ei"],"Two f letters, then remember the ie in -iency.","The new machine improved efficiency by wasting less fuel."],
  ["entrepreneur","A person who starts and runs a business.",["entreprenuer","entrepeneur"],"entrepre[neur]",["nuer","ner"],"Break it up: en + tre + pre + neur. The ending has eu.","The entrepreneur opened a new shop."],
  ["patent","An official right that lets an inventor control who makes or sells an invention for a time.",["patant","pattent"],"pat[e]nt",["a","i"],"Pat + ent. Use one t in the middle.","The inventor received a patent for the new tool."],
  ["canal","A waterway built by people for boats or to move water.",["canel","cannal"],"can[a]l",["e","o"],"Ca + nal. Both vowels are a.","The boat traveled along the canal."],
  ["steamboat","A boat powered by an engine that uses steam.",["steemboat","steambote"],"st[ea]mboat",["ee","e"],"Steam + boat. Remember ea, then oa.","A steamboat carried people down the river."],
  ["wage","Money a worker earns for doing a job.",["waje","waige"],"wa[g]e",["j","gg"],"The g makes a j sound. End with a silent e.","The worker earned a wage for each hour of work."],
  ["union","A group of workers who join together to improve their pay and working conditions.",["unoin","unyon"],"un[io]n",["oi","yo"],"Remember the order: u, n, i, o, n.","The union asked for safer working conditions."],
  ["economy","The way a community makes, buys, and sells goods and services.",["econamy","ecomony"],"econ[o]my",["a","e"],"Econ + omy. Use o after the n.","New businesses helped the economy grow."],
  ["progress","Movement forward or improvement toward a goal.",["progres","proggress"],"progre[ss]",["s","ce"],"One g and two s letters.","Daily practice helped her make progress."],
  ["mechanization","The use of machines to do work that people or animals once did.",["mechanazation","mecanization"],"me[ch]anization",["c","sh"],"Mechan + ization. Keep the h after the c.","Mechanization changed the way farmers worked.",true],
].map(([word, definition, misspellings, pattern, gapDistractors, hint, sentence, bonus = false]) => ({
  word, definition, misspellings, pattern, gapDistractors, hint, sentence, bonus,
}));

export default {
  "id": "industrial-revolution-week-7",
  "title": "Week 7 · The Industrial Revolution",
  "description": "Inventions, industry, and a changing world.",
  words,
};
