import { AppState } from "types"

// export const DEFAULT_TEXT: string = "Ils se trouvaient dans la salle de radio - dont l'appareillage, par mille détails subtils, donnait déjà l'impression d'être démodé pour être resté inutilisé pendant dix ans avant leur arrivée. Oui, dix ans, sur le plan technique, cela comptait énormément. Il suffisait de comparer Speedy au modèle de 2005. Mais on en était arrivé au stade où les robots se perfectionnaient à une allure ultrarapide. Powell posa un doigt hésitant sur une surface métallique qui avait conservé son poli. L'atmosphère d’abandon qui imprégnait tous les objets contenus dans la pièce - et la Station tout entière - avait quelque chose d’infiniment déprimant."
export const DEFAULT_TEXT: string = "test"

export const INITIAL_APP_STATE: AppState = {
  text: {
    raw: DEFAULT_TEXT,
    editing: false
  },
  metrics: {
    start: undefined,
    stop: undefined,
    current_char: undefined,
    keystrokes_nb: 0,
    valid_nb: 0,
    errors_nb: 0,
    replay_nb: 0,
    error: undefined,
  },
  records: {
    pending: true,
    accuracy: 0,
    wpm: 0
  }
}
