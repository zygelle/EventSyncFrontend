
export const pathLogin = '/login'
export const pathRegister = '/cadastro'
export const pathHome = '/'
export const pathEvents = '/eventos'
export const pathFilterEvent = '/evento/buscar'
export const pathViewEvent = `/evento/:id`
export const setPathViewEvent = (id: string) => {
    return `/evento/${id}`
}
export const pathCreateEvents = '/evento/criar'
export const pathEditEvents = `/evento/editar/:id`
export const setPathEditEvent = (id: string) => {
    return `/evento/editar/${id}`
}
export const pathCheckIn = '/evento/minha-agenda'