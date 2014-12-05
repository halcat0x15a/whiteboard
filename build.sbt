org.scalatra.sbt.ScalatraPlugin.scalatraFullSettings

scalaVersion := "2.11.4"

val jetty = "9.1.3.v20140225"

libraryDependencies ++= Seq(
  "org.scala-stm" %% "scala-stm" % "0.7",
  "org.json4s" %% "json4s-jackson" % "3.2.9",
  "org.scalatra" %% "scalatra-atmosphere" % "2.3.0",
  "org.eclipse.jetty" % "jetty-plus" % jetty % "container;provided",
  "org.eclipse.jetty" % "jetty-webapp" % jetty % "container",
  "org.eclipse.jetty.websocket" % "websocket-server" % jetty % "container;provided"
)

port in container.Configuration := 8082
