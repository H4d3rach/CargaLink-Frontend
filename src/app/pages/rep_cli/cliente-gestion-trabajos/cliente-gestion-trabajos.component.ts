import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { Router, RouterLink } from '@angular/router';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';
import { modeloOferta } from '../../../servicios/ofertas/modeloOferta';
import { PostulacionService } from '../../../servicios/postulaciones/postulacion.service';
import { modeloPostulcion } from '../../../servicios/postulaciones/modeloPostulacion';
import { ChatBService } from '../../../servicios/chatbot/chat-b.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente-gestion-trabajos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cliente-gestion-trabajos.component.html',
  styleUrl: './cliente-gestion-trabajos.component.css'
})
export class ClienteGestionTrabajosComponent implements OnInit {
  
  private _login = inject(LoginService);
  private _oferta = inject(OfertaService);
  private _postulacion = inject(PostulacionService);
  private router = inject(Router);
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isUserLogged: boolean = false;
  ofertasPublicadasList: modeloOferta[]=[];
  viajesEnCursoList: modeloOferta[]=[];
  viajesFinalizados: modeloOferta[]=[];
  postulacionList: modeloPostulcion[] = [];
  finalizadosList: modeloPostulcion[] = [];
  private _chatbot = inject(ChatBService);
  preguntaChat: string = '';
  historialMensajesChatbot: {clase: string, msj: string}[] = [];
  ngOnInit(): void {
    this._login.ifisUserLogged.subscribe({ //Conexion al servicio del login para determinar si el usuario está loggeado
      next:(isUserLogged)=>{
        this.isUserLogged =isUserLogged;
      },
      error: (errorData) =>{
        console.log(errorData);
      },
      complete: () => {
        if(this.isUserLogged == false){
          this.router.navigateByUrl('login');
        }
      }
    });
    this._oferta.viewMyOfertas().subscribe((ofertasData)=>{
      this.ofertasPublicadasList = ofertasData.filter(oferta => oferta.estatus === 'OFERTA');
      const estatusEnCurso = [
        'FINALIZADO',
        'CONFIGURADO',
        'CONFIGURANDO'
      ];
      this.viajesEnCursoList = ofertasData.filter(oferta => oferta.estatus && estatusEnCurso.includes(oferta.estatus));
      const promise = this.viajesEnCursoList.map(oferta =>
        this._postulacion.viewAllPostulaciones(oferta.idOferta!).toPromise()
      );
      Promise.all(promise)
      .then((postulaciones)=>{
        this.postulacionList = postulaciones.map(postulaciones => postulaciones![0]);
      })
      .catch((error)=>{
        console.error('Error al obtener las postulaciones:', error);
      });

      this.postulacionList.sort((a, b) => { 
        return estatusEnCurso.indexOf(a.oferta.estatus||'') - estatusEnCurso.indexOf(b.oferta.estatus||''); 
      });

      this.viajesFinalizados = ofertasData.filter(oferta => oferta.estatus === 'PAGADO');
      const promesa = this.viajesFinalizados.map(oferta =>
        this._postulacion.viewAllPostulaciones(oferta.idOferta!).toPromise()
      );
      Promise.all(promesa)
      .then((postulaciones)=>{
        this.finalizadosList = postulaciones.map(postulaciones => postulaciones![0]);
      })
      .catch((error)=>{
        console.error('Error al obtener las postulaciones:', error);
      });
    }
    )
    const historial = localStorage.getItem('chatMensajes');
  if(historial){
    this.historialMensajesChatbot = JSON.parse(historial);
  }
  const chatOpenGuardado = localStorage.getItem('chatOpen'); 
  if(chatOpenGuardado){
    this.chatOpen = chatOpenGuardado === 'true';
  }
  }
  
  verPostulaciones(id: number){
    this.router.navigate(['/cliente/gestion/oferta/postulaciones/',id]);
  }
  verDetalles(id: number){
    this.router.navigate(['/cliente/gestion/oferta/detalles/',id])
  }
  eliminar(id: number){
    this._oferta.deleteOferta(id).subscribe({
      next: ()=>{
        console.log("Oferta eliminada");
        this.ofertasPublicadasList = this.ofertasPublicadasList.filter(oferta => oferta.idOferta != id);
      },
      error: (error)=>{
        console.log(error);
      }
    })
  }
  preguntarChat(){
    this.historialMensajesChatbot.push({clase: 'usuario', msj: this.preguntaChat});
    this._chatbot.usarChatbot(this.preguntaChat).subscribe((respuesta)=>{
      this.historialMensajesChatbot.push({clase: 'bot', msj: respuesta.respuesta});
      localStorage.setItem('chatMensajes', JSON.stringify(this.historialMensajesChatbot));
    })
    this.preguntaChat=""
  }
  detalles(id: number | undefined){
    this.router.navigate(['/cliente/gestion/trabajo/detalles/',id])
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
    localStorage.setItem('chatOpen', this.chatOpen ? 'true' : 'false');
  }
  chat(id:string | undefined){
    this.router.navigate(['/cliente/chat/',id]);
  }
  logout(){ //Metodo que ayuda a cerrar sesión
    localStorage.removeItem("chatMensajes");
    localStorage.removeItem("chatOpen");
    localStorage.removeItem("TipoEmpresa");
    this._login.logout();
    this.router.navigateByUrl('');
  }
}
