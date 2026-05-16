$(document).ready(function () {
 
    // ----------------------------------------
    // ABRIR MODAL: NOVO AGENDAMENTO
    // ----------------------------------------
    $("#btn_novo").on("click", function () {
        limparModal();
        $("#modal_titulo").text("NOVO AGENDAMENTO");
        $("#modal_overlay").fadeIn(200);
        $("#campo_cliente").focus();
    });
 
    // ----------------------------------------
    // ABRIR MODAL: EDITAR
    // O PHP renderiza o botão com data-* preenchidos:
    // <button class="btn-editar"
    //     data-id="<?= $ag['id'] ?>"
    //     data-cliente="<?= $ag['cliente'] ?>"
    //     data-servico="<?= $ag['servico'] ?>"
    //     data-barbeiro="<?= $ag['barbeiro'] ?>"
    //     data-data="<?= $ag['data'] ?>"
    //     data-horario="<?= $ag['horario'] ?>"
    //     data-status="<?= $ag['status'] ?>">
    // ----------------------------------------
    $(document).on("click", ".btn-editar", function () {
        const btn = $(this);
 
        $("#modal_titulo").text("EDITAR AGENDAMENTO");
 
        $("#campo_id").val(btn.data("id"));
        $("#campo_cliente").val(btn.data("cliente"));
        $("#campo_servico").val(btn.data("servico"));
        $("#campo_barbeiro").val(btn.data("barbeiro"));
        $("#campo_data").val(btn.data("data"));
        $("#campo_horario").val(btn.data("horario"));
        $("#campo_status").val(btn.data("status"));
 
        $("#modal_overlay").fadeIn(200);
        $("#campo_cliente").focus();
    });
 
    // FECHAR MODAL PRINCIPAL
    $("#modal_fechar, #modal_cancelar").on("click", fecharModal);
 
    $("#modal_overlay").on("click", function (e) {
        if ($(e.target).is("#modal_overlay")) fecharModal();
    });
 
    function fecharModal() {
        $("#modal_overlay").fadeOut(200);
        limparModal();
    }
 
    function limparModal() {
        $("#campo_id").val("");
        $("#campo_cliente").val("");
        $("#campo_servico").val("");
        $("#campo_barbeiro").val("");
        $("#campo_data").val("");
        $("#campo_horario").val("");
        $("#campo_status").val("aguardando");
    }
 
    // ----------------------------------------
    // ABRIR MODAL: CONFIRMAR EXCLUSÃO
    // O PHP renderiza o botão com data-* preenchidos:
    // <button class="btn-deletar-linha"
    //     data-id="<?= $ag['id'] ?>"
    //     data-nome="<?= $ag['cliente'] ?>">
    // ----------------------------------------
    $(document).on("click", ".btn-deletar-linha", function () {
        const id   = $(this).data("id");
        const nome = $(this).data("nome");
 
        $("#del_nome").text(nome);
        $("#modal_del_confirmar").data("id", id); // passa o id pro botão confirmar
        $("#modal_del_overlay").fadeIn(200);
    });
 
    // FECHAR MODAL DE EXCLUSÃO
    $("#modal_del_fechar, #modal_del_cancelar").on("click", fecharModalDel);
 
    $("#modal_del_overlay").on("click", function (e) {
        if ($(e.target).is("#modal_del_overlay")) fecharModalDel();
    });
 
    function fecharModalDel() {
        $("#modal_del_overlay").fadeOut(200);
    }
    // FECHAR MODAIS COM TECLA ESC
    $(document).on("keydown", function (e) {
        if (e.key === "Escape") {
            fecharModal();
            fecharModalDel();
        }
    });
 
    // ----------------------------------------
    // TOAST DE FEEDBACK
    // O PHP redireciona após salvar/deletar com
    // um parâmetro na URL, ex:
    //   header("Location: admin.php?toast=criado");
    //   header("Location: admin.php?toast=editado");
    //   header("Location: admin.php?toast=deletado");
    //   header("Location: admin.php?toast=erro");
    // O JS lê esse parâmetro e exibe o toast
    // ----------------------------------------
    const params      = new URLSearchParams(window.location.search);
    const toastParam  = params.get("toast");
 
    const mensagens = {
        criado:  { msg: "Agendamento criado!",     tipo: "sucesso" },
        editado: { msg: "Agendamento atualizado!", tipo: "sucesso" },
        deletado:{ msg: "Agendamento excluído.",   tipo: "sucesso" },
        erro:    { msg: "Algo deu errado.",         tipo: "erro"    },
    };
 
    if (toastParam && mensagens[toastParam]) {
        const { msg, tipo } = mensagens[toastParam];
        mostrarToast(msg, tipo);
 
        // Limpa o parâmetro da URL sem recarregar
        window.history.replaceState({}, "", window.location.pathname);
    }
 
    function mostrarToast(msg, tipo) {
        const icone = tipo === "sucesso"
            ? '<i class="fa-solid fa-circle-check"></i>'
            : '<i class="fa-solid fa-circle-xmark"></i>';
 
        $("#toast")
            .removeClass("toast-sucesso toast-erro")
            .addClass("toast-" + tipo)
            .html(icone + " " + msg)
            .fadeIn(200);
 
        setTimeout(function () {
            $("#toast").fadeOut(300, function () {
                $(this).removeClass("toast-sucesso toast-erro");
            });
        }, 3000);
    }
 
});