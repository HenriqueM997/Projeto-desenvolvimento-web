document.addEventListener('DOMContentLoaded', () => {
  console.log("JS carregado!"); 

  const baseUrl = 'http://localhost:3001';
  const tabela = document.getElementById('tabela-pacientes');
  const form = document.getElementById('add-paciente-form');
  const listaPacientes = document.getElementById('pacientes-list');

   async function carregarPacientes() {
    console.log("Iniciando carregamento..."); // Debug
    try {
      const response = await fetch(`${baseUrl}/pacientes`);
      console.log("Resposta recebida:", response); // Debug
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const pacientes = await response.json();
      console.log("Pacientes recebidos:", pacientes); // Debug

      const tbody = tabela.querySelector('tbody');
      tbody.innerHTML = '';
      
      if (pacientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">Nenhum paciente cadastrado</td></tr>';
        return;
      }

      pacientes.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${p.nome}</td>
          <td>${p.email || ''}</td>
          <td>${p.telefone || ''}</td>`;
        tbody.appendChild(row);
      });
      
    } catch (err) {
      console.error('Erro ao carregar pacientes:', err);
      tabela.querySelector('tbody').innerHTML = `
        <tr><td colspan="3">Erro ao carregar pacientes: ${err.message}</td></tr>`;
    }
  }

  async function adicionarPaciente(nome, email, telefone) {
    try {
      const response = await fetch(`${baseUrl}/pacientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone })
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        carregarPacientes();
      } else {
        alert('Erro ao cadastrar paciente');
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor.');
      console.error(err);
    }
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome').value.trim();
      const email = document.getElementById('email').value.trim();
      const telefone = document.getElementById('telefone').value.trim();
      if (!nome || !email || !telefone) {
        return alert('Todos os campos são obrigatórios.');
      }
      adicionarPaciente(nome, email, telefone);
      form.reset();
    });
  }

  if (tabela || listaPacientes) {
    carregarPacientes();
  }

  const lista = document.getElementById("lista-consultas");
  if (lista) {
    fetch(`${baseUrl}/consultas`)
      .then(res => res.json())
      .then(consultas => {
        consultas.forEach(c => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${c.nome_paciente}</td>
            <td>${c.data}</td>
            <td>${c.hora}</td>
            <td>${c.status}</td>
            <td>
              <button onclick="deletarConsulta(${c.id})" style="color:red">Excluir</button>
            </td>`;
          lista.appendChild(tr);
        });
      });
  }
});

function deletarConsulta(id) {
  if (confirm("Deseja mesmo excluir esta consulta?")) {
    fetch(`http://localhost:3001/consultas/${id}`, { method: 'DELETE' })
      .then(() => location.reload());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3001/pacientes') 
    .then(res => res.json())
    .then(pacientes => {
      const select = document.getElementById('paciente_id');
      pacientes.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.nome;
        select.appendChild(option);
      });
    })
    .catch(err => console.error('Erro ao buscar pacientes:', err));
});