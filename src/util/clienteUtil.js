import { join } from './misc';

export function nomeTags(e) {
  return join([e.nome, ...e.tags.map(tag => `${e.nome} ${tag} ${e.nome}`)], ' ')
}