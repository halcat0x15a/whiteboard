package whiteboard

import org.json4s._

import org.scalatra.{ScalatraServlet, SessionSupport}
import org.scalatra.atmosphere._
import org.scalatra.json.{JValueResult, JacksonJsonSupport}

import scala.concurrent.stm._

import scala.concurrent.ExecutionContext.Implicits.global

class WhiteBoard extends ScalatraServlet
    with JValueResult
    with JacksonJsonSupport
    with SessionSupport
    with AtmosphereSupport {

  implicit protected val jsonFormats: Formats = DefaultFormats

  val strokes: Ref[List[JsonAST.JValue]] = Ref(Nil)

  get("/strokes") {
    JArray(strokes.single.get.reverse)
  }

  atmosphere("/whiteboard") {
    new AtmosphereClient {
      def receive = {
        case JsonMessage(json) =>
          atomic(implicit t => strokes.transform(json :: _))
          broadcast(json)
      }
    }
  }

}
