const URL = "http://127.0.0.1:5500/memotest.html"

const cantCartas = 12

describe('Memotest', () => {
  
  it("Comprobar que existe un tablero con cartas", () => {
    cy.visit(URL)
    cy.get("#contenedor-cartas").find(".grid-carta").should("have.length", cantCartas)
  })
  it('se asegura que los cuadros sean aleatorios', () => {
    cy.visit(URL)
    cy.get('#boton-mezclar-reiniciar').click()
    cy.get('.imgCarta').then((imagenes) => {
      let imagenesOriginales = [];
      imagenes.each(function(i, imagen) {
        imagenesOriginales.push(imagen.src);
      });

      cy.visit(URL);
      cy.get(".btn-mezclar").click()

      let imagenesNuevas = [];
      cy.get('.imgCarta').then(nuevasImagenes => {
        nuevasImagenes.each(function(i, imagenNueva) {
          imagenesNuevas.push(imagenNueva.src);
        });

        cy.wrap(imagenesOriginales).should('not.deep.equal', imagenesNuevas);
      });
    });
  });


  describe('resuelve el juego', () => {
    let mapaDePares, listaDePares;
    it('elige una combinación errónea', () => {
      cy.visit(URL)
      cy.get('#boton-mezclar-reiniciar').click()
      cy.get('.imgCarta').then(cartas => {
        mapaDePares = obtenerParesDeCartas(cartas);
        listaDePares = Object.values(mapaDePares);
        cy.get(listaDePares[0][0]).click();
        cy.get(listaDePares[1][0]).click();

        cy.get('.imgCarta').should('have.length', cantCartas);
      });
    });

    it('resuelve el juego', () => {
      cy.visit(URL)
      cy.get('#boton-mezclar-reiniciar').click()

      cy.get('.imgCarta').then(cartas => {
        mapaDePares = obtenerParesDeCartas(cartas);
        listaDePares = Object.values(mapaDePares);

        listaDePares.forEach((par) => {
          cy.get(par[0]).click();
          cy.get(par[1]).click();
          cy.wait(500);
        });
      });
      
      cy.get('#contenedor-cartas').should('not.be.visible');
      cy.get('#ganaste').
          should('be.visible').
          contains(
              "GANASTE SOS BUENISIMO!!!",
          );
    });
  });
});

function obtenerParesDeCartas(cartas) {
  const pares = {};

  cartas.each((i, carta) => {
    const srcCarta = carta.src

    if (pares[srcCarta]) {
      pares[srcCarta].push(carta);
    } else {
      pares[srcCarta] = [carta];
    }
  });

  console.log(pares);
  return pares;
}