import { faHome, faTruck, faMobile, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { formatReal } from './Format';
import { equals, isNEU, join } from './misc';

export function IcoTipo(tipo) {
    switch (tipo) {
      case "CAIXA":
        return faHome;
      case "ENTREGA":
        return faTruck;
      case "APLICATIVO":
        return faMobile;
      default:
        return faQuestion;
    }
  }

  export function CorTipo(tipo) {
    switch (tipo) {
      case "CAIXA":
        return "#2b2e30";
      case "ENTREGA":
        return "#040ac9";
      case "APLICATIVO":
        return "#591357";
      default:
        return '#000'
    }
  }


  export function getDataPagamentoDescrito(data){

    data = new Date(data)
    let horas = data.toLocaleTimeString([], {timeStyle: 'short'})

    let dataATUAL = new Date();

    let ms = dataATUAL - data;

    let m = ms / 1000 / 60;

    let h = m / 60;

    m = h % 1 * 60

    let d = h / 24;

    return (
      d < 1 
      ? `às ${horas}` 
      : d < 2
      ? `ontem às ${horas}` 
      : `em ${data.toLocaleDateString()}`
      ) 

}

export function getOnly1Id(item){
  return item?.id ? item.id
  : item?.ids?.length > 0 ? item.ids[0] 
  : null
}
export function getOnly1Item(itens, grupo){
  return itens.find(e => equals(e.id, getOnly1Id(grupo)))
}

export function getItensAgrupados(pedido){
  if(pedido){
      const _itens = [...pedido.itens]
      let pizzasGrupo = []
      let bebidasGrupo = []
      let outrosGrupo = []
      for(let item of _itens){
        if(item.tipo === 0){
            //pizza
            let achou = false
            for(let grupo of pizzasGrupo){
              if(item.pizza.tamanho.nome === grupo.pizza.tamanho.nome
                && getSaboresDescritos(item.pizza.sabores) === getSaboresDescritos(grupo.pizza.sabores)
                && item.observacoes === grupo.observacoes && item.pizza.valor === getOnly1Item(pedido.itens, grupo)?.valor){
                  if(grupo.id){grupo.ids = [grupo.id]}
                  grupo.ids = [...grupo.ids, item.id]
                  grupo.valor += item.valor
                  delete grupo.id
                  achou = true
                  break;
                }
            }
            if(!achou){pizzasGrupo.push({...item})}   
          }else if(item.tipo === 1){
            //bebida
            let achou = false
            for(let grupo of bebidasGrupo){
              if(item.bebida.id === grupo.bebida.id
                && item.bebida.tamanho === grupo.bebida.tamanho
                && item.bebida.sabor === grupo.bebida.sabor
                && item.bebida.tipo === grupo.bebida.tipo
                && item.observacoes === grupo.observacoes
                && item.bebida.valor ===  getOnly1Item(pedido.itens, grupo)?.valor){
                  if(grupo.id){grupo.ids = [grupo.id]}
                  grupo.ids = [...grupo.ids, item.id]
                  grupo.valor += item.valor
                  delete grupo.id
                  achou = true
                  break;
                }
            }
            if(!achou){bebidasGrupo.push({...item})}    
          }else if(item.tipo === 2){
            const a = 'hamburguer'
          }else if(item.tipo === 3){
            //outro
            let achou = false
            for(let grupo of outrosGrupo){

              if(item.outro.id === grupo.outro.id
                && item.outro.nome === grupo.outro.nome
                && item.observacoes === grupo.observacoes
                && item.outro.valor === getOnly1Item(pedido.itens, grupo)?.valor){
                  if(grupo.id){
                    grupo.ids = [grupo.id]
                  }
                  grupo.ids = [...grupo.ids, item.id]
                  grupo.valor += item.valor
                  delete grupo.id
                  achou = true
                  break;
                }
            }
            if(!achou){outrosGrupo.push({...item})}    
        }
      }
      return [...pizzasGrupo, ...bebidasGrupo, ...outrosGrupo].sort((a,b) => {
        const maxA = a?.ids?.reduce((max, current) => max > current ? max : current) ?? a.id
        const maxB = b?.ids?.reduce((max, current) => max > current ? max : current) ?? b.id
        if(maxA > maxB) return -1
        if(maxA < maxB) return 1
        return 0
      })
  }else{
        return []
  }
}

export function getSaboresDescritos(sabores, quebra=', '){
  const joinTipoAdd = (ingredientes) => ingredientes.map(i => i.tipoAdd ? i.tipoAdd : '').join('')
  const getIngredientesDiferentes = (ingredientes) => ingredientes.filter(i => i.tipoAdd && i.tipoAdd !== '').map(i => `${i.tipoAdd} ${i.nome}`).join(', ')

  let saboresDiferentes = sabores.filter(e => joinTipoAdd(e.ingredientes) !== '')
  let outrosSabores = sabores.filter(e => joinTipoAdd(e.ingredientes) === '')
  let r = saboresDiferentes.map(e => `${e.nome} (${getIngredientesDiferentes(e.ingredientes)})`).join(quebra)
  r = join([r, outrosSabores.map(e => e.nome).join(quebra)], quebra)
  return r
}

export function getInfoSecundarias(item) {

  if(item.tipo === 0) return getSaboresDescritos(item.pizza.sabores)
  
  if(item.tipo === 1) return item.bebida.tipo
      
  if(item.tipo === 2) return 'HAMBURGUER'
  
  return ''

}

export function getTituloPagamento(pagamento) {

  const val = `${formatReal(pagamento.valorPago)} - ` 

  const esp = pagamento.tipo === 0 ? 'EM ESPÉCIE' : ''
  const car = pagamento.tipo === 1 ? 'NO CARTÃO' : ''
  const onl = pagamento.tipo === 2 ? 'VIA PIX' : ''
  const tra =  pagamento.tipo === 3 ? 'TRANSFERÊNCIA BANCÁRIA' : ''
  const pro =  pagamento.tipo === 4 ? `AGENDADO P/ ${pagamento.progr.data}` : ''
  const des =  pagamento.tipo === 5 ? 'NÃO INFORMADO' : ''
  const stt = pagamento.tipo !== 5 ? (pagamento.status === 1 
              ? ' (PAGO)' : ' (PENDENTE)') : ''

  const res = join([esp, car, onl, tra, pro, des], '')

  return isNEU(res) ? 'DESCONHECIDO PELO SISTEMA' : val + res + stt

}

export function getValorPago(pedido){
  const res = pedido?.pagamentos?.filter(e => e.status === 1).reduce((a,b) => a + b.valorPago, 0) || 0
  // if(pedido?.cliente?.id === 1076) console.log(res)
  return res
}

export function getValorPagamentosPagosOuNao(pedido){
  const res = pedido?.pagamentos?.reduce((a,b) => a + b.valorPago, 0) || 0
  // if(pedido?.cliente?.id === 1076) console.log(res)
  return res
}

export function getValorPendente(pedido, qualquerValorNaListaConta=false){
  const res = (pedido?.valor || 0) - (qualquerValorNaListaConta 
    ? getValorPagamentosPagosOuNao(pedido)
    : getValorPago(pedido))
    // console.log(pedido, 'valor pedido - valor pago ou n', res)
  return res
}