-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-11-2018 a las 14:54:23
-- Versión del servidor: 10.1.36-MariaDB
-- Versión de PHP: 7.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `myface`
--
CREATE DATABASE IF NOT EXISTS `myface` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `myface`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tabla_preguntas`
--

CREATE TABLE `tabla_preguntas` (
  `id` int(11) NOT NULL,
  `texto_pregunta` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tabla_preguntas`
--

INSERT INTO `tabla_preguntas` (`id`, `texto_pregunta`) VALUES
(6, 'que tal?');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tabla_relacion`
--

CREATE TABLE `tabla_relacion` (
  `id` int(11) NOT NULL,
  `id_usuario_A` int(11) NOT NULL,
  `id_usuario_B` int(11) NOT NULL,
  `estado_relacion` int(11) NOT NULL,
  `usuario_inicio_relacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tabla_relacion`
--

INSERT INTO `tabla_relacion` (`id`, `id_usuario_A`, `id_usuario_B`, `estado_relacion`, `usuario_inicio_relacion`) VALUES
(12, 0, 2, 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tabla_respuestas`
--

CREATE TABLE `tabla_respuestas` (
  `id` int(11) NOT NULL,
  `id_pregunta` int(11) NOT NULL,
  `texto` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tabla_respuestas`
--

INSERT INTO `tabla_respuestas` (`id`, `id_pregunta`, `texto`) VALUES
(13, 6, 'bien\r'),
(14, 6, 'mal');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tabla_respuestas_usuario`
--

CREATE TABLE `tabla_respuestas_usuario` (
  `id_respuesta` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tabla_respuestas_usuario`
--

INSERT INTO `tabla_respuestas_usuario` (`id_respuesta`, `id_usuario`) VALUES
(13, 0),
(13, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tabla_usuario`
--

CREATE TABLE `tabla_usuario` (
  `id` int(15) NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `imagen` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tabla_usuario`
--

INSERT INTO `tabla_usuario` (`id`, `nombre`, `imagen`) VALUES
(0, 'alex', 'plugg'),
(2, 'marata', 'plug'),
(3, 'capullo', 'ei'),
(4, 'nuevo', ''),
(5, 'otro', '');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `tabla_preguntas`
--
ALTER TABLE `tabla_preguntas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tabla_relacion`
--
ALTER TABLE `tabla_relacion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `tabla_respuestas`
--
ALTER TABLE `tabla_respuestas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tabla_usuario`
--
ALTER TABLE `tabla_usuario`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tabla_preguntas`
--
ALTER TABLE `tabla_preguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `tabla_relacion`
--
ALTER TABLE `tabla_relacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `tabla_respuestas`
--
ALTER TABLE `tabla_respuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
