import javax.servlet.ServletContext
import org.scalatra.LifeCycle
import whiteboard.WhiteBoard

class ScalatraBootstrap extends LifeCycle {
  override def init(context: ServletContext) {
    context.mount(new WhiteBoard, "/*")
  }
}
