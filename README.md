# :video_game: TETRIS :video_game:
## Autor: González Sabariego, Francisco Javier.

<div style="text-align: left;">
    <img src="https://img.shields.io/badge/version-1.2.3-blue" alt="version">
    <a href="https://twitter.com/intent/follow?screen_name=Fco_Javier_Glez" target="_blank">
        <img src="https://img.shields.io/twitter/follow/Fco_Javier_Glez?style=social&logo=twitter" alt="follow on Twitter">
    </a>
</div>

---

## License

Copyright (c) 2021 Francisco Javier González Sabariego. [Licensed under the MIT license](https://github.com/FcoJavierGlez/tetris_js/blob/main/LICENSE).

## Acceso al juego:

Puedes acceder a través del siguiente enlace: **[Juego del Tetris](https://fcojavierglez.github.io/tetris_js/)**.

<p style="text-aling: justify;">
    <b><u>Aviso importante</u>:</b> Actualmente el juego no funciona en los navegadores de Firefox. Es debido a que he usado métodos y atributos privados en clases declaradas con la palabra reservada 'class', y ésta característica es, en el momento de redactar este aviso, una característica en desarrollo y actualmente no implementada en los navegadores Firefox.
</p>

---

## Instrucciones:

### Controles:

- **Espacio:** Pausa / reanuda el juego.
- **Cursor arriba:** Rota la pieza 90 grados en sentido de las agujas del reloj.
- **Cursor abajo:** Baja la pieza más rápido y obten puntos extra al hacerlo.
- **Cursores laterales:** Desplaza la pieza hacia los lados.

### ¿Cómo se juega?:

<p style="text-aling: justify;">
    En el juego del Tetris debes combinar las piezas que van cayendo con el único objetivo de crear líneas completas y acumular el máximo número de puntos posibles antes de perder la partida.
</p>

![captura1](img_readme/captura1.png)
![captura2](img_readme/captura2.png)  *Ejemplo de una línea completa.*
![captura3](img_readme/captura3.png)  *Aumento de puntos tras limpiar una línea.*

<p style="text-aling: justify;">
    Si eres capaz de completar más de una línea a la vez, por cada línea adicional, recibirás puntos extra. Si eliminas 4 líneas a la vez, lo que se denomina un Tetris, obtendrás la máxima puntuación posible para tu nivel (a más nivel más puntos por línea eliminada).
</p>

![captura4](img_readme/captura4.png)  *Ejemplo de un Tetris (completar 4 líneas a la vez).*
![captura5](img_readme/captura5.png)  *Eliminar más de una línea a la vez, siendo el Tetris el máximo, da muchos puntos.*

<p style="text-aling: justify;">
    Por cada 10 líneas que eliminas incrementas un nivel. A más nivel más puntos recibes, pero cuidado, porque igualmente irá incrementando la velocidad de juego. El nivel máximo alcanzable es el 10, para lo que tendrás que haber eliminado 100 líneas.
</p>

![captura6](img_readme/captura6.png)  *Incremento de nivel por cada 10 líneas eliminadas.*

<p style="text-aling: justify;">
    Si rebasas el tablero por la parte superior impidiendo a otras piezas aparecer perderás inmediatamente la partida. ¡Buena suerte!
</p>

![captura7](img_readme/captura7.png)  *Si alguna pieza queda bloqueada rebasando la parte superior del tablero la partida acabará inmediatamente.*

## Dificultad:

He considerado que la velocidad del juego escale en función a la dificultad elegida (panel de configuración inicial) y del nivel actual que posea el jugador [0-10]. Por ello la dificultad del juego se divide en rangos de velocidad (dificultad elegida) y escalado porcentual según el nivel actual del jugador.

### Rangos de velocidad:

Los rangos de velocidad son únicos para cada dificultad y están comprendidos desde un valor máximo (nivel 0) y mínimo (nivel 10).

![range_speed](img_readme/range_speed.png)  *Rangos de velocidad*

### Escalado porcentual:

Conforme el jugador va incrementado sus niveles la velocidad del juego incrementa de forma porcentual, disminuyendo el delay de movimiento automático de la pieza entre el rango máximo y mínimo de su dificultad.

![percentage_by_level](img_readme/percentage_by_level.png)  *Escalado porcentual*

De esta forma obtenemos una curvatura para cada dificultad y nivel:

![chart_difficulty](img_readme/chart_difficulty.png)  *Curvatura de disminución del delay*