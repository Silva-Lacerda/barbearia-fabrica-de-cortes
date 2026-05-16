// =============================================
// usuario.js - Interações e animações da tela
// Fabrica dos Cortes
//
// Responsabilidade deste arquivo:
// - Abrir e fechar modais
// - Limpar formulário
// - Exibir toast de feedback
// - O restante (dados, banco) é feito pelo PHP
// =============================================

$(document).ready(function () {

    // ----------------------------------------
    // ABRIR MODAL: NOVO AGENDAMENTO
    // Disparado pelo botão principal e pelo
    // botão da tela vazia
    // ----------------------------------------
    $("#btn_novo, #btn_novo_vazio").on("click", function () {
        limparModal();
        $("#modal_overlay").fadeIn(200);
        $("#campo_servico").focus();
    });

    // ----------------------------------------
    // FECHAR MODAL DE AGENDAMENTO
    // ----------------------------------------
    $("#modal_fechar, #modal_cancelar").on("click", fecharModal);

    $("#modal_overlay").on("click", function (e) {
        if ($(e.target).is("#modal_overlay")) fecharModal();
    });

    function fecharModal() {
        $("#modal_overlay").fadeOut(200);
        limparModal();
    }

    function limparModal() {
        $("#campo_servico").val("");
        $("#campo_barbeiro").val("");
        $("#campo_data").val("");
        $("#campo_horario").val("");
    }

    // ----------------------------------------
    // ABRIR MODAL: CONFIRMAR CANCELAMENTO
    // O PHP renderiza o botão com data-* preenchidos:
    // <button class="btn-cancelar-ag"
    //     data-id="<?= $ag['id'] ?>"
    //     data-servico="<?= $ag['servico'] ?>">
    // ----------------------------------------
    $(document).on("click", ".btn-cancelar-ag", function () {
        const servico = $(this).data("servico");
        const id      = $(this).data("id");

        $("#cancel_servico").text(servico);

        // Passa o id para o link de confirmação
        // PHP vai processar: cancelar.php?id=X
        $("#modal_cancel_confirmar").attr("href", "cancelar.php?id=" + id);

        $("#modal_cancel_overlay").fadeIn(200);
    });

    // ----------------------------------------
    // FECHAR MODAL DE CANCELAMENTO
    // ----------------------------------------
    $("#modal_cancel_fechar, #modal_cancel_cancelar").on("click", fecharModalCancel);

    $("#modal_cancel_overlay").on("click", function (e) {
        if ($(e.target).is("#modal_cancel_overlay")) fecharModalCancel();
    });

    function fecharModalCancel() {
        $("#modal_cancel_overlay").fadeOut(200);
    }

    // ----------------------------------------
    // FECHAR MODAIS COM TECLA ESC
    // ----------------------------------------
    $(document).on("keydown", function (e) {
        if (e.key === "Escape") {
            fecharModal();
            fecharModalCancel();
        }
    });

    // ----------------------------------------
    // TOAST DE FEEDBACK
    // O PHP redireciona após a ação com
    // um parâmetro na URL, ex:
    //   header("Location: usuario.php?toast=agendado");
    //   header("Location: usuario.php?toast=cancelado");
    //   header("Location: usuario.php?toast=erro");
    // ----------------------------------------
    const params     = new URLSearchParams(window.location.search);
    const toastParam = params.get("toast");

    const mensagens = {
        agendado: { msg: "Agendamento realizado!",  tipo: "sucesso" },
        cancelado:{ msg: "Agendamento cancelado.",  tipo: "sucesso" },
        erro:     { msg: "Algo deu errado.",         tipo: "erro"    },
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