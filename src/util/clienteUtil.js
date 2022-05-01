import { faHome, faTruck, faMobile, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { formatReal } from './Format';
import { equals, isNEU, join } from './misc';

export function nomeTags(e) {
  return join([e.nome, ...e.tags.map(tag => `${e.nome} ${tag} ${e.nome}`)], ' ')
}