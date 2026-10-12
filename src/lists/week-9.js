// Supplied “Number the Stars — Part 2, Spelling List – Week 9”.
// Definitions, hints, and example sentences are original practice material.
const words = [
  ['funeral', 'A ceremony held to remember a person who has died.', ['funerel', 'funral'], 'funer[a]l', ['e', 'i'], 'Fun + er + al. Remember the a in the ending -al.', 'Friends and family gathered for the funeral.'],
  ['casket', 'A box in which a person who has died is placed for burial.', ['caskit', 'caskett'], 'cask[e]t', ['i', 'a'], 'Cas + ket. Use e in the ending -ket.', 'Flowers were placed beside the casket.'],
  ['mourner', 'A person who feels or shows sadness because someone has died.', ['morner', 'mournor'], 'm[ou]rner', ['o', 'oo'], 'Mourn + er. Keep the ou from mourn.', 'Each mourner brought a flower to remember their friend.'],
  ['wharf', 'A structure along the water where boats stop to load or unload.', ['warf', 'wharff'], '[wh]arf', ['w', 'hw'], 'Start with wh, and end with one f.', 'The fishing boat unloaded its catch at the wharf.'],
  ['harbor', 'A sheltered area of water where boats can stay safely.', ['harber', 'harborr'], 'harb[o]r', ['e', 'a'], 'Har + bor. Use o in the ending -bor.', 'The boats stayed in the harbor during the storm.'],
  ['fjord', 'A long, narrow inlet of the sea between steep cliffs, carved by a glacier.', ['fjordd', 'fjiord'], 'f[j]ord', ['i', 'ji'], 'Begin with fj, then add ord.', 'Their boat sailed through a fjord between tall cliffs.'],
  ['thicket', 'A dense group of bushes or small trees growing close together.', ['thickit', 'thiket'], 'thi[ck]et', ['k', 'c'], 'Thick + et. Keep the ck from thick.', 'A rabbit hid in the thicket beside the path.'],
  ['lantern', 'A lamp with a protective cover that can be carried or hung up.', ['lanturn', 'lantarn'], 'lant[er]n', ['ur', 'or'], 'Lan + tern. Remember er before the final n.', 'We carried a lantern to light the dark path.'],
  ['packet', 'A small bundle of items wrapped or packed together.', ['packit', 'paket'], 'pa[ck]et', ['k', 'c'], 'Pack + et. Keep the ck from pack.', 'She opened a packet of seeds for the garden.'],
  ['pouch', 'A small, flexible bag used for carrying things.', ['pouh', 'powch'], 'p[ou]ch', ['ow', 'oo'], 'Use ou for the vowel sound, then end with ch.', 'He kept his coins in a cloth pouch.'],
  ['scent', 'A smell, especially one that can help identify something.', ['sent', 'scentt'], 's[c]ent', ['s', 'k'], 'Remember the silent c after the s.', 'The dog followed the scent along the trail.'],
  ['patrol', 'To move around an area regularly to watch for trouble or keep it safe.', ['patroll', 'petrol'], 'patro[l]', ['ll', 'le'], 'Pa + trol. End with one l.', 'The guards patrol the grounds each night.'],
  ['apprehend', 'To catch and arrest someone suspected of breaking the law.', ['aprehend', 'apprehant'], 'a[pp]rehend', ['p', 'pr'], 'Use two p letters: ap + pre + hend.', 'The officers worked together to apprehend the thief.'],
  ['tremble', 'To shake slightly because of fear, cold, or strong feelings.', ['trembel', 'tremblee'], 'tremb[le]', ['el', 'al'], 'Trem + ble. The ending is -le, with l before e.', 'My hands began to tremble in the cold wind.'],
  ['exhausted', 'Very tired, with little energy left.', ['exausted', 'exhaustid'], 'ex[h]austed', ['s', 'he'], 'Keep the h after ex: ex + haust + ed.', 'After the long hike, we felt exhausted.'],
  ['panic', 'A sudden feeling of great fear that makes it hard to think calmly.', ['panick', 'pannic'], 'pani[c]', ['ck', 'k'], 'Pan + ic. End with c, without a k.', 'She felt a moment of panic when she could not find her bag.'],
  ['determined', 'Firmly decided to do something, even when it is difficult.', ['determind', 'deturmined'], 'determin[e]d', ['a', 'i'], 'Determine + d. Keep the e before the final d.', 'He was determined to finish the puzzle.'],
  ['insist', 'To say firmly that something must happen or is true.', ['insest', 'insisst'], 'ins[i]st', ['e', 'a'], 'In + sist. Both vowels are i.', 'I insist that everyone gets a turn.'],
  ['comfort', 'To help someone feel less sad, worried, or afraid.', ['comfert', 'comfoort'], 'comf[o]rt', ['e', 'oo'], 'Com + fort. Both vowels are o.', 'She tried to comfort her friend after a difficult day.'],
  ['reunion', 'A gathering of people who have been apart for some time.', ['reunoin', 'reunyon'], 'reun[io]n', ['oi', 'yo'], 'Re + union. Keep i before o in the ending -ion.', 'Our family reunion brought cousins together after a long time apart.'],
  ['moonlight', 'Light from the sun reflected by the moon at night.', ['moonlite', 'monlight'], 'moonli[gh]t', ['g', 'h'], 'Join moon and light. Keep the silent gh in light.', 'Moonlight shone through the bedroom window.'],
  ['weave', 'To make fabric or a basket by passing threads or strips over and under each other.', ['weve', 'weav'], 'w[ea]ve', ['e', 'ee'], 'Use ea for the long e sound, and keep the final e.', 'We learned to weave a basket from strips of paper.'],
  ['complicated', 'Having many connected parts or steps that make something hard to understand or do.', ['complicatd', 'complikated'], 'complicat[e]d', ['a', 'i'], 'Complicate + d. Keep the e before the final d.', 'The complicated map had many paths and symbols.'],
  ['dizzy', 'Feeling as if you or the things around you are spinning.', ['dizy', 'dizzie'], 'di[zz]y', ['z', 'zs'], 'Use two z letters and end with y.', 'Spinning around too fast made me feel dizzy.'],
  ['memorial', 'An object or place made to honor and remember a person or event.', ['memoreal', 'memoriall'], 'memor[i]al', ['e', 'y'], 'Mem + or + i + al. Remember i before the ending -al.', 'The town built a memorial to honor those who had died.'],
  ['handkerchief', 'A small square of cloth used for wiping your nose or face.', ['hankerchief', 'handkercheif'], 'han[d]kerchief', ['t', 'dd'], 'Remember hand + ker + chief, with a d and i before e.', 'He took a clean handkerchief from his pocket.', true],
].map(([word, definition, misspellings, pattern, gapDistractors, hint, sentence, bonus = false]) => ({
  word, definition, misspellings, pattern, gapDistractors, hint, sentence, bonus,
}));

export default {
  id: 'number-the-stars-part-2-week-9',
  title: 'Week 9 · Number the Stars — Part 2',
  description: 'A journey by the sea, strong feelings, and remembering loved ones.',
  words,
};
