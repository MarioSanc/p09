-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-12-2018 a las 16:57:09
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

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('sThuu6GpPyQaNFUIIYQ5lDmhKyzc6h4U', 1544362507, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"usuario@ucm.es\",\"currentUserId\":1}'),
('tjdYfQa20bhjh0caNZpjYdbNngOiDuNW', 1544362180, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"usuario@ucm.es\",\"currentUserId\":1}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tabla_preguntas`
--

CREATE TABLE `tabla_preguntas` (
  `id` int(11) NOT NULL,
  `texto_pregunta` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tabla_preguntas`
--

INSERT INTO `tabla_preguntas` (`id`, `texto_pregunta`) VALUES
(1, 'alex pregun'),
(2, 'mario pregu'),
(3, 'hola'),
(4, '¿de que col'),
(5, 'probando la'),
(6, 'era problema de la db'),
(7, '¿como quieres la cena?');

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
(1, 1, 2, 0, 0),
(2, 3, 1, 1, 0);

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
(1, 1, 'hola\r'),
(2, 1, 'adios'),
(3, 2, 'hola \r'),
(4, 2, 'que'),
(5, 2, 'nueva'),
(6, 3, 's'),
(7, 4, 'blanco\r'),
(8, 4, 'negro\r'),
(9, 4, 'rubio'),
(10, 5, 's'),
(11, 6, 'si\r'),
(12, 6, 'no'),
(13, 6, 'valetio'),
(14, 7, 'hecha\r'),
(15, 7, 'sin hacer');

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
(1, 1),
(5, 2),
(13, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `genero` enum('hombre','mujer','otro','') NOT NULL,
  `imagen` varchar(100) DEFAULT NULL,
  `puntos` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `email`, `password`, `nombre`, `fechaNacimiento`, `genero`, `imagen`, `puntos`) VALUES
(1, 'usuario@ucm.es', '', 'alex', '0000-00-00', '', NULL, NULL),
(2, 'mario@ucm.es', '', 'mario', '0000-00-00', '', NULL, NULL),
(3, 'a@a', '', 'aa', '0000-00-00', '', NULL, NULL);

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
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`email`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tabla_preguntas`
--
ALTER TABLE `tabla_preguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tabla_relacion`
--
ALTER TABLE `tabla_relacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tabla_respuestas`
--
ALTER TABLE `tabla_respuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
