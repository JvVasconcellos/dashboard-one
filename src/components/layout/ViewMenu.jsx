import React, { useState, useLayoutEffect } from "react";
import { MdMoreHoriz, MdOutlineClose, MdOutlineCheck } from "react-icons/md";
import { FaCogs, FaRegTrashAlt, FaHistory } from "react-icons/fa";
import { ImNewTab } from "react-icons/im";
import EditIcon from "../../media/pencil-alt2_1.38c5ca60.svg";
import sydleApi from "../../services/SydleApi";
import sydleMessenger from "../../services/SydleMessenger";
import OutsideAlerter from "./OutsideAlerter";

import "./styles.css";
import "../Loader/styles.css";

export default function ViewMenu(props) {
  // States
  const [openMoreOptions, setOpenMoreOptions] = useState(false);
  const [acl, setAcl] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Functions

  // Função utilizada para abrir o rascunho de edição do objeto
  async function createDraft() {
    const draft = await sydleApi.createDraft(props.docObj._class._id, props.docObj._id);

    sydleMessenger.sendMessage(
      "_open",
      {
        queryParameters: {
          cid: props.docObj._class._id,
          id: draft._id,
          isDraft: true,
        },
        view: "explorer_new_object",
        stack: "push",
      },
      "explorer_object_details",
    );
  }

  // Função utilizada para fechar modal de confirmação de remoção
  function handleCloseModal() {
    setShowDeleteModal(false);
  }

  // Função para abrir dropdown no click do botão More Options
  const handleMoreOptBtClick = (value) => {
    if (value === null || value === undefined) setOpenMoreOptions(!openMoreOptions);
    else setOpenMoreOptions(value);
  };

  // Função para montar e disparar a mensagem para abrir os campos do sistema
  function sendOpenSystemFieldsMessage() {
    const queryParameters = {
      cid: props.docObj._class._id,
      id: props.docObj._id,
      systemFieldsOf: props.docObj.title,
    };

    sydleMessenger.sendMessage(
      "_open",
      {
        view: "explorer_object_advanced_fields_view",
        stack: "push",
        queryParameters,
      },
      "explorer_object_details",
    );
  }

  // Função para montar e disparar a mensagem para abrir o histórico do objeto
  function sendOpenHistoryMessage() {
    const queryParameters = {
      cid: props.docObj._class._id,
      id: props.docObj._id,
      historyOf: props.docObj.title,
    };

    sydleMessenger.sendMessage(
      "_open",
      {
        view: "explorer_history_list",
        stack: "push",
        queryParameters,
      },
      "explorer_object_details",
    );
  }

  // Função para deletar o objeto
  async function confirmDeleteModal() {
    setIsLoading(true);
    const res = await sydleApi._delete({ _id: props.docObj._id });

    if (res === "success") {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  }

  // Função para abrir serviço do SD referente a doc
  async function openServiceInSD() {
    const url = await sydleApi.openServiceInSD({ _id: props.docObj._id });

    if (typeof (url) === "string") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  // Obtém as permissões de acesso dos métodos
  useLayoutEffect(() => {
    async function setAclBt() {
      const acl = await sydleApi.getAcl({ objectId: props.docObj._id });
      console.log("acl", acl);
      setAcl(acl);
    }

    setAclBt();
  }, []);

  // Renderização
  return (
    <>
      {acl
        ? (
          <>
            <OutsideAlerter action={handleMoreOptBtClick}>
              <div className="container">
                {acl.access._update === true
                  ? (
                    <button type="button" className="sy-fab sy-fab-dark edit-bt" onClick={() => createDraft()}>
                      <img src={EditIcon} alt="Edit" />
                    </button>
                  )
                  : null}

                <button type="button" className="sy-fab sy-fab-dark more-opt-bt" onClick={() => handleMoreOptBtClick()}>
                  <span className="sy-icon"><MdMoreHoriz /></span>
                </button>
                {openMoreOptions ? (

                  <div className="dropdown">
                    <ul className="ul-drop-menu">
                      {acl.access.openServiceInSD === true
                        ? (
                          <li className="li-drop-menu" onClick={() => openServiceInSD()}>
                            <ImNewTab className="menu-item-icon" />
                            Abrir serviço no SD
                          </li>
                        )
                        : null }
                      {acl.access._getHistory === true
                        ? (
                          <li className="li-drop-menu" onClick={() => sendOpenHistoryMessage()}>
                            <FaHistory className="menu-item-icon" />
                            Histórico
                          </li>
                        )
                        : null }
                      {acl.access._delete === true
                        ? (
                          <li className="li-drop-menu" onClick={() => setShowDeleteModal(true)}>
                            <FaRegTrashAlt className="menu-item-icon" />
                            Remover
                          </li>
                        )
                        : null}
                      <li className="li-drop-menu" onClick={() => sendOpenSystemFieldsMessage()}>
                        <FaCogs className="menu-item-icon" />
                        Campos do sistema
                      </li>
                    </ul>
                  </div>
                ) : null}
              </div>
            </OutsideAlerter>

            {showDeleteModal ? (
              <>
                <div className="modalBackground" onClick={() => handleCloseModal()} />
                <div className="confirmDeleteModal">
                  <div style={{ display: "inline-flex" }}>
                    <div className="titleDeleteModal">
                      Confirmação de exclusão
                      <span style={{ marginLeft: "107px", cursor: "pointer" }} onClick={() => handleCloseModal()}><MdOutlineClose /></span>
                    </div>

                  </div>
                  {!isLoading ? (
                    <>
                      <div className="textDeleteModal">Tem certeza que deseja excluir a documentação?</div>
                      <div style={{ marginLeft: "200px" }}>
                        <button type="button" className="btNot" onClick={() => handleCloseModal()}>
                          <span className="closeIcon"><MdOutlineClose /></span>
                          <span>Não</span>
                        </button>
                        <button type="button" className="btYes" onClick={() => confirmDeleteModal()}>
                          <span className="confirmIcon"><MdOutlineCheck /></span>
                          <span>Sim</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="lds-ring">
                      <div />
                      <div />
                      <div />
                      <div />
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </>
        )
        : null}
    </>
  );
}
