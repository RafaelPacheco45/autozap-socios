(() => {
  'use strict';
  const $=id=>document.getElementById(id),config=window.AUTOZAP_SOCIOS;
  let token='',busy=false,requestVersion=0;
  function status(text,error=false){$('accessStatus').textContent=text;$('accessStatus').classList.toggle('error',error);}
  function clearRecord(){
    $('holderName').textContent='Sua participação começa com uma confirmação.';
    $('holderDescription').textContent='Os dados do titular aparecem aqui depois de consultar um registro confirmado.';
    for(const id of ['recordUnits','recordPercent','recordDate'])$(id).textContent='—';
    $('recordId').textContent='Disponível após confirmação e formalização.';
    $('recordBadge').textContent='Aguardando acesso';$('recordBadge').classList.remove('confirmed');
    $('recordDetails').hidden=true;$('formalization').textContent='';$('followOrder').href=config.investments+'#captacao';
  }
  function parseLink(value){
    try{const url=new URL(value.trim());if(url.protocol!=='https:'||!['socio.autozap.log.br','investimentos.autozap.log.br'].includes(url.hostname))return '';
      return (url.hash.match(/^#(?:captacao\/)?access=([A-Za-z0-9_-]{43})$/)||[])[1]||'';
    }catch{return '';}
  }
  async function load(){
    if(busy)return;clearRecord();
    if(!config.api){status('O portal já está disponível. A consulta aos registros será habilitada após a ativação do serviço de confirmação.');return;}
    if(!token){status('Abra seu link individual ou cole-o no campo acima.');return;}
    busy=true;const version=++requestVersion;$('accessSubmit').disabled=true;$('refreshRecord').disabled=true;
    document.querySelector('.access-card').setAttribute('aria-busy','true');status('Consultando sua participação…');
    try{
      const response=await fetch(config.api+'/v1/membership',{headers:{Authorization:'Bearer '+token},cache:'no-store',signal:AbortSignal.timeout(20000)});
      const data=await response.json();if(version!==requestVersion)return;
      if(!response.ok)throw Error(data.error||'Não foi possível consultar este registro.');
      const date=new Date(data.confirmed);
      if(typeof data.name!=='string'||!data.name.trim()||!Number.isInteger(data.units)||data.units<1||data.units>1000||!Number.isFinite(date.getTime())||typeof data.id!=='string')throw Error('O registro retornou informações incompletas. Entre em contato com a AutoZap.');
      $('holderName').textContent=data.name;$('holderDescription').textContent='Sua participação foi confirmada e consta no registro da AutoZap.';
      $('recordUnits').textContent=data.units.toLocaleString('pt-BR');$('recordPercent').textContent=(data.units/100).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+'%';
      $('recordDate').textContent=date.toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'});$('recordId').textContent=data.id;
      $('recordBadge').textContent='Participação confirmada';$('recordBadge').classList.add('confirmed');
      $('formalization').textContent=data.formalization?'Formalização: '+data.formalization:'';
      $('recordDetails').hidden=false;$('followOrder').href=config.investments+'#captacao/access='+token;
      $('sessionActions').hidden=false;$('accessForm').hidden=true;status('Registro consultado com sucesso.');
    }catch(error){if(version===requestVersion)status(error.name==='TimeoutError'?'A consulta demorou mais que o esperado. Tente novamente.':error.message,true);}
    finally{busy=false;$('accessSubmit').disabled=false;$('refreshRecord').disabled=false;document.querySelector('.access-card').removeAttribute('aria-busy');}
  }
  $('accessForm').addEventListener('submit',event=>{event.preventDefault();if(busy)return;const value=parseLink($('accessLink').value);if(!value){status('Cole o link individual completo recebido da AutoZap.',true);return;}token=value;$('accessLink').value='';history.replaceState(null,'',location.pathname+'#access='+token);$('sessionActions').hidden=false;load();});
  $('refreshRecord').addEventListener('click',load);
  $('leaveSession').addEventListener('click',()=>{requestVersion++;token='';history.replaceState(null,'',location.pathname+'#acesso');clearRecord();$('accessForm').hidden=false;$('sessionActions').hidden=true;$('accessLink').value='';status('Acesso encerrado neste navegador.');});
  const match=location.hash.match(/^#access=([A-Za-z0-9_-]{43})$/);
  if(match){token=match[1];$('sessionActions').hidden=false;load();}else if(!config.api){status('A consulta aos registros aguarda a ativação do serviço de confirmação.');}
})();
