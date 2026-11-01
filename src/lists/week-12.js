// Supplied “Thanksgiving and November, Spelling List: Week 12”.
// Spelling answers are lowercase; proper names keep capitals in teaching text.
const words = [
  ['thanksgiving', 'A holiday when people give thanks, often by sharing a special meal.', ['thanksgving', 'thanksgivving'], 'thanks[g]iving', ['j', 'gg'], 'Join thanks and giving. Capitalize Thanksgiving when naming the holiday.', 'Our family shares a meal on Thanksgiving.'],
  ['gratitude', 'A feeling of thanks for something kind or helpful.', ['gratetude', 'grattitude'], 'grat[i]tude', ['e', 'a'], 'Grat + i + tude. Remember i after t.', 'She expressed gratitude for her friend’s help.'],
  ['harvest', 'The gathering of ripe crops from fields or gardens.', ['harvist', 'harvvest'], 'harv[e]st', ['i', 'a'], 'Har + vest. Use e before st.', 'The farmers worked together during the harvest.'],
  ['pilgrim', 'A person who travels to a place for religious reasons; also a name used for some English settlers at Plymouth.', ['pilgram', 'pillgrim'], 'pilgr[i]m', ['a', 'e'], 'Pil + grim. Both vowels are i.', 'The book described the journey of a pilgrim.'],
  ['voyage', 'A long journey, especially by sea or through space.', ['voyadge', 'voyige'], 'voy[a]ge', ['i', 'e'], 'Voy + age. Use a before ge.', 'The ship began a voyage across the ocean.'],
  ['settlement', 'A place where people establish a community and make their homes.', ['setlement', 'settlemant'], 'se[tt]lement', ['t', 'tl'], 'Settle + ment. Keep both t letters and the e.', 'The settlement grew as more families built homes there.'],
  ['feast', 'A large, special meal shared in celebration.', ['feest', 'feestt'], 'f[ea]st', ['ee', 'ie'], 'Use ea for the long e sound.', 'Everyone helped prepare the feast.'],
  ['celebrate', 'To mark a special event with enjoyable activities.', ['celabrate', 'celebrait'], 'cel[e]brate', ['a', 'i'], 'Cel + e + brate. Remember e after l.', 'We celebrate the holiday with music and food.'],
  ['tradition', 'A custom or belief passed from one generation to another.', ['traditon', 'traditionn'], 'tradit[i]on', ['e', 'y'], 'Tra + di + tion. Keep i in the ending tion.', 'Making soup together is a family tradition.'],
  ['blessing', 'Something good that brings happiness or help, or words asking for divine care.', ['blesing', 'blesseng'], 'ble[ss]ing', ['s', 'sc'], 'Bless + ing. Keep the two s letters.', 'Having a caring friend is a blessing.'],
  ['generous', 'Willing to give or share more than is expected.', ['generus', 'genorous'], 'gener[ou]s', ['u', 'oo'], 'Gen + er + ous. The ending is ous.', 'Our generous neighbor shared vegetables from her garden.'],
  ['thankful', 'Feeling or showing thanks.', ['thankfull', 'thankfel'], 'thank[f]ul', ['ff', 'ph'], 'Thank + ful. The ending ful has one l.', 'I am thankful for the people who care for me.'],
  ['autumn', 'The season between summer and winter, also called fall.', ['autum', 'autmun'], 'autum[n]', ['m', 'ne'], 'Keep the silent n after m.', 'Leaves change color during autumn.'],
  ['november', 'The eleventh month of the year.', ['novembar', 'novemmber'], 'novemb[er]', ['ar', 'or'], 'No + vem + ber. Capitalize November when writing the month.', 'November comes after October.'],
  ['cranberry', 'A small, tart red berry that grows on a low plant.', ['cranbery', 'crannberry'], 'cranbe[rr]y', ['r', 're'], 'Cran + berry. Use two r letters and end with y.', 'I tasted a cranberry before it was cooked into sauce.'],
  ['pumpkin', 'A large, round squash, often orange, with a thick rind and many seeds.', ['pumkin', 'pumpken'], 'pum[p]kin', ['b', 'pp'], 'Pump + kin. Remember the p before k.', 'We made soup from a pumpkin.'],
  ['turkey', 'A large bird native to North America, often raised for food.', ['turky', 'terkey'], 'turk[e]y', ['i', 'a'], 'Tur + key. Keep the e before y.', 'A wild turkey walked along the edge of the woods.'],
  ['stuffing', 'A seasoned mixture, often made with bread, served with or cooked inside another food.', ['stufing', 'stuffeng'], 'stu[ff]ing', ['f', 'ph'], 'Stuff + ing. Keep the two f letters.', 'The stuffing smelled of bread and herbs.'],
  ['together', 'With one another, in the same place, or as a group.', ['togather', 'togethor'], 'tog[e]ther', ['a', 'i'], 'To + get + her. Remember e in get.', 'We cleaned the kitchen together.'],
  ['kindness', 'The quality of being caring, friendly, and helpful.', ['kindnes', 'kindniss'], 'kindne[ss]', ['s', 'sc'], 'Kind + ness. End with two s letters.', 'His kindness helped the new student feel welcome.'],
  ['appreciate', 'To recognize the value of something or feel grateful for it.', ['apreciate', 'appreceate'], 'a[pp]reciate', ['p', 'pr'], 'Ap + pre + ci + ate. Use two p letters.', 'I appreciate the time you spent helping me.'],
  ['community', 'A group of people who live in the same area or share something in common.', ['comunity', 'communnity'], 'co[mm]unity', ['m', 'mn'], 'Com + mu + ni + ty. Use two m letters.', 'Our community collected food for neighbors.'],
  ['mayflower', 'The name of the ship that carried English settlers to Plymouth in 1620.', ['mayflouer', 'mayflowr'], 'mayflo[w]er', ['u', 'ww'], 'Join May and flower. Capitalize Mayflower when naming the ship.', 'The Mayflower crossed the Atlantic Ocean in 1620.'],
  ['plentiful', 'Available in a large amount; more than enough.', ['plentifull', 'plenteful'], 'plent[i]ful', ['e', 'a'], 'Plenty changes to plenti before ful. End with one l.', 'Fresh apples were plentiful after the harvest.'],
  ['share', 'To let someone else use or have part of something.', ['shair', 'sharre'], 'sh[a]re', ['ai', 'e'], 'Use a and a final silent e.', 'We share our supplies with classmates.'],
  ['cornucopia', 'A horn-shaped basket or container shown overflowing with fruits, vegetables, and other foods.', ['cornocopia', 'cornucopya'], 'corn[u]copia', ['o', 'a'], 'Cor + nu + co + pi + a. Remember u after corn.', 'The table decoration was a cornucopia filled with colorful fruit.', true],
].map(([word, definition, misspellings, pattern, gapDistractors, hint, sentence, bonus = false]) => ({
  word, definition, misspellings, pattern, gapDistractors, hint, sentence, bonus,
}));

export default {
  id: 'thanksgiving-and-november-week-12',
  title: 'Week 12 · Thanksgiving and November',
  description: 'Giving thanks, sharing, and the autumn harvest.',
  words,
};
