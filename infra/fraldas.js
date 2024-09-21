import {
  doc,
  getDoc,
  setDoc, 
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export async function obterOuCriarEstoqueUsuario(userId) {
  const docRef = doc(db, "fraldas", userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
   
    await setDoc(docRef, {
      estoqueTotal: 0, 
    });
    console.log("Documento criado para o usuário:", userId);
    return { estoqueTotal: 0 }; 
  }


  return docSnap.data();
}

export async function atualizarEstoqueTotalUsuario(userId, quantidade) {
  const docRef = doc(db, "fraldas", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const dadosAtuais = docSnap.data();
    const novoEstoque = dadosAtuais.estoqueTotal + quantidade;

    await updateDoc(docRef, { estoqueTotal: novoEstoque });
    console.log("Estoque total atualizado com sucesso para o usuário:", novoEstoque);
  } else {
    console.error("Documento do usuário não encontrado!");
  }
}

