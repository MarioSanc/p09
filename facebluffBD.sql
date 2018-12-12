-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-12-2018 a las 23:30:32
-- Versión del servidor: 10.1.28-MariaDB
-- Versión de PHP: 7.1.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `facebluff`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes`
--

CREATE TABLE `imagenes` (
  `id` int(5) NOT NULL,
  `id_usuario` int(5) NOT NULL,
  `imagen` longblob NOT NULL,
  `descripcion` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
('1K3PPdD45QrN1YT2LqDRlSVMCULEsgL7', 1544739696, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"mario@ucm.es\",\"currentUserId\":19,\"currentUserPoints\":100,\"currentUserImage\":true}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tabla_preguntas`
--

CREATE TABLE `tabla_preguntas` (
  `id` int(5) NOT NULL,
  `texto_pregunta` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tabla_relacion`
--

CREATE TABLE `tabla_relacion` (
  `id` int(5) NOT NULL,
  `id_usuario_A` int(5) NOT NULL,
  `id_usuario_B` int(5) NOT NULL,
  `estado_relacion` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tabla_respuestas`
--

CREATE TABLE `tabla_respuestas` (
  `id` int(11) NOT NULL,
  `id_pregunta` int(11) NOT NULL,
  `texto` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tabla_respuestas_usuario`
--

CREATE TABLE `tabla_respuestas_usuario` (
  `id_respuesta` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(5) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `genero` enum('hombre','mujer','otro') NOT NULL,
  `imagen` mediumblob,
  `puntos` int(5) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario_fk` (`id_usuario`);

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
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `usuarioA_usuarioB` (`id_usuario_A`,`id_usuario_B`),
  ADD KEY `id_usuario_B` (`id_usuario_B`);

--
-- Indices de la tabla `tabla_respuestas`
--
ALTER TABLE `tabla_respuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pregunta_fk` (`id_pregunta`);

--
-- Indices de la tabla `tabla_respuestas_usuario`
--
ALTER TABLE `tabla_respuestas_usuario`
  ADD PRIMARY KEY (`id_respuesta`,`id_usuario`),
  ADD KEY `id_usuario` (`id_usuario`);

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
-- AUTO_INCREMENT de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `tabla_preguntas`
--
ALTER TABLE `tabla_preguntas`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tabla_relacion`
--
ALTER TABLE `tabla_relacion`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tabla_respuestas`
--
ALTER TABLE `tabla_respuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD CONSTRAINT `id_usuario_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tabla_relacion`
--
ALTER TABLE `tabla_relacion`
  ADD CONSTRAINT `tabla_relacion_ibfk_1` FOREIGN KEY (`id_usuario_A`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `tabla_relacion_ibfk_2` FOREIGN KEY (`id_usuario_B`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `tabla_respuestas`
--
ALTER TABLE `tabla_respuestas`
  ADD CONSTRAINT `id_pregunta_fk` FOREIGN KEY (`id_pregunta`) REFERENCES `tabla_preguntas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tabla_respuestas_usuario`
--
ALTER TABLE `tabla_respuestas_usuario`
  ADD CONSTRAINT `tabla_respuestas_usuario_ibfk_1` FOREIGN KEY (`id_respuesta`) REFERENCES `tabla_respuestas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tabla_respuestas_usuario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
