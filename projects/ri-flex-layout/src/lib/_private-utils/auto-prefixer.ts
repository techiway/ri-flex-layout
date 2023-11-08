/**
 * Method for apply css prefix css
 * @export
 * @param  {({[key: string]: any | null})} target 
 * @return 
 */
export function applyCssPrefixes(target: {[key: string]: any | null}) {
  for (let key in target) {
    let value = target[key] ?? '';

    switch (key) {
      case 'display':
        if (value === 'flex') {
          target['display'] = [
            '-webkit-flex',
            'flex'
          ];
        } else if (value === 'inline-flex') {
          target['display'] = [
            '-webkit-inline-flex',
            'inline-flex'
          ];
        } else {
          target['display'] = value;
        }
        break;

      case 'align-items':
      case 'align-self':
      case 'align-content':
      case 'flex':
      case 'flex-basis':
      case 'flex-flow':
      case 'flex-grow':
      case 'flex-shrink':
      case 'flex-wrap':
      case 'justify-content':
        target['-webkit-' + key] = value;
        break;

      case 'flex-direction':
        target['-webkit-flex-direction'] = value;
        target['flex-direction'] = value;
        break;

      case 'order':
        target['order'] = target['-webkit-' + key] = isNaN(+value) ? '0' : value;
        break;
    }
  }
  return target;
}
