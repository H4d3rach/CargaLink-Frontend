import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ETransporteRegistroComponent } from './pages/e-transporte-registro/e-transporte-registro.component';
import { EClienteRegistroComponent } from './pages/e-cliente-registro/e-cliente-registro.component';
import { UsuarioRegistroComponent } from './pages/usuario-registro/usuario-registro.component';
import { PrincipalComponent } from './pages/reptrans/principal/principal.component';
import { RegSedeComponent } from './pages/reptrans/reg-sede/reg-sede.component';
import { GestionSedeComponent } from './pages/reptrans/gestion-sede/gestion-sede.component';
import { GestionTransportistaComponent } from './pages/reptrans/gestion-transportista/gestion-transportista.component';
import { RegTransportistaComponent } from './pages/reptrans/reg-transportista/reg-transportista.component';
import { GestionVehiculoComponent } from './pages/reptrans/gestion-vehiculo/gestion-vehiculo.component';
import { RegVehiculoComponent } from './pages/reptrans/reg-vehiculo/reg-vehiculo.component';
import { GestionSemirremolqueComponent } from './pages/reptrans/gestion-semirremolque/gestion-semirremolque.component';
import { RegSemirremolqueComponent } from './pages/reptrans/reg-semirremolque/reg-semirremolque.component';
import { GestionTrabajosComponent } from './pages/reptrans/gestion-trabajos/gestion-trabajos.component';
import { ConfiguracionCuentaReptransComponent } from './pages/reptrans/configuracion-cuenta-reptrans/configuracion-cuenta-reptrans.component';
import { SeeWorkDetailsComponent } from './pages/reptrans/see-work-details/see-work-details.component';
import { ChatComponent } from './pages/reptrans/chat/chat.component';
import { ChatSalaComponent } from './pages/reptrans/chat-sala/chat-sala.component';
import { PostulacionComponent } from './pages/reptrans/postulacion/postulacion.component';
import { TransChatComponent } from './pages/transportista/trans-chat/trans-chat.component';
import { TransChatSalaComponent } from './pages/transportista/trans-chat-sala/trans-chat-sala.component';
import { TransHomeComponent } from './pages/transportista/trans-home/trans-home.component';
import { TransConfigComponent } from './pages/transportista/trans-config/trans-config.component';
import { ClienteHomeComponent } from './pages/rep_cli/cliente-home/cliente-home.component';
import { ClienteChatComponent } from './pages/rep_cli/cliente-chat/cliente-chat.component';
import { ClienteChatSalaComponent } from './pages/rep_cli/cliente-chat-sala/cliente-chat-sala.component';
import { ClienteGestionTrabajosComponent } from './pages/rep_cli/cliente-gestion-trabajos/cliente-gestion-trabajos.component';
import { ClienteConfiguracionComponent } from './pages/rep_cli/cliente-configuracion/cliente-configuracion.component';
import { ClienteOfertaDetallesComponent } from './pages/rep_cli/cliente-oferta-detalles/cliente-oferta-detalles.component';
import { ClienteOfertaPostulacionesComponent } from './pages/rep_cli/cliente-oferta-postulaciones/cliente-oferta-postulaciones.component';
import { ClientePostulacionesDetallesComponent } from './pages/rep_cli/cliente-postulaciones-detalles/cliente-postulaciones-detalles.component';
import { ClienteTrabajoDetallesComponent } from './pages/rep_cli/cliente-trabajo-detalles/cliente-trabajo-detalles.component';
import { ClienteTrabajoPagarComponent } from './pages/rep_cli/cliente-trabajo-pagar/cliente-trabajo-pagar.component';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';
import { AdminGestionCuentasComponent } from './pages/admin/admin-gestion-cuentas/admin-gestion-cuentas.component';
import { rutasGuard } from './servicios/autenticacion/rutas.guard';
import { UpdSedeComponent } from './pages/reptrans/upd-sede/upd-sede.component';
import { UpdVehiculoComponent } from './pages/reptrans/upd-vehiculo/upd-vehiculo.component';
import { UpdSemiComponent } from './pages/reptrans/upd-semi/upd-semi.component';
import { UpdTransportistaComponent } from './pages/reptrans/upd-transportista/upd-transportista.component';
import { ClienteTransporteDetallesComponent } from './pages/rep_cli/cliente-transporte-detalles/cliente-transporte-detalles.component';

export const routes: Routes = [
    {path: '', component: HomeComponent },
    {path: 'login', component: LoginComponent},
    {path: 'etransporte_registro', component: ETransporteRegistroComponent},
    {path: 'ecliente_registro', component: EClienteRegistroComponent},
    {path: 'usuario_registro', component: UsuarioRegistroComponent},
    {path: 'rep_trans', component: PrincipalComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/detalles_trabajo/:idTrabajo', component: SeeWorkDetailsComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/sedes', component: GestionSedeComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/transportistas', component: GestionTransportistaComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/vehiculos', component: GestionVehiculoComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/semirremolques', component: GestionSemirremolqueComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/trabajos', component: GestionTrabajosComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/sedes/registrar', component: RegSedeComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/transportistas/registrar', component: RegTransportistaComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/vehiculos/registrar', component: RegVehiculoComponent ,canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/semirremolques/registrar', component: RegSemirremolqueComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/sedes/:id', component: UpdSedeComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/vehiculos/:placa', component: UpdVehiculoComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/semirremolques/:id', component: UpdSemiComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/transportistas/:id', component: UpdTransportistaComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/configuracion', component: ConfiguracionCuentaReptransComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/chat', component: ChatComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/chat/:idSala', component: ChatSalaComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'rep_trans/postularse/:idTrabajo', component: PostulacionComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_TRANSPORTE'}},
    {path: 'transportista/chat', component: TransChatComponent, canActivate: [rutasGuard], data: {rol: 'TRANSPORTISTA'}},
    {path: 'transportista/chat/:idSala', component: TransChatSalaComponent, canActivate: [rutasGuard], data: {rol: 'TRANSPORTISTA'}},
    {path: 'transportista', component: TransHomeComponent, canActivate: [rutasGuard], data: {rol: 'TRANSPORTISTA'}},
    {path: 'transportista/configuracion', component: TransConfigComponent, canActivate: [rutasGuard], data: {rol: 'TRANSPORTISTA'}},
    {path: 'cliente', component: ClienteHomeComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_CLIENTE'}},
    {path: 'cliente/chat', component: ClienteChatComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_CLIENTE'}},
    {path: 'cliente/chat/:idSala', component: ClienteChatSalaComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_CLIENTE'}},
    {path: 'cliente/gestion', component: ClienteGestionTrabajosComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_CLIENTE'}},
    {path: 'cliente/gestion/oferta/:idOferta', component: ClienteOfertaDetallesComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_CLIENTE'}},
    {path: 'cliente/gestion/oferta/postulante/:idRepresentante', component: ClienteTransporteDetallesComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_CLIENTE'}},
    {path: 'cliente/gestion/oferta/postulaciones/:idOferta', component: ClienteOfertaPostulacionesComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_CLIENTE'}},
    {path: 'cliente/gestion/oferta/postulaciones/detalles/:idPostulacion', component: ClientePostulacionesDetallesComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_CLIENTE'}},
    {path: 'cliente/gestion/oferta/detalles/:idOferta', component: ClienteTrabajoDetallesComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_CLIENTE'}},
    {path: 'cliente/gestion/trabajo/pagar/:idTrabajo', component: ClienteTrabajoPagarComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_CLIENTE'}},
    {path: 'cliente/configuracion', component: ClienteConfiguracionComponent, canActivate: [rutasGuard], data: {rol: 'REPRESENTANTE_CLIENTE'}},
    {path: 'admin', component: AdminHomeComponent, canActivate: [rutasGuard], data: {rol: 'ADMINISTRADOR'}},
    {path: 'admin/gestion', component: AdminGestionCuentasComponent, canActivate: [rutasGuard], data: {rol: 'ADMINISTRADOR'}},
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
