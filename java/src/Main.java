import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Main {

    public static void main(String[] args) throws IOException, InterruptedException {
        List<String> command = new ArrayList<String>();
        System.out.println(System.getProperty("user.dir"));
        command.add("/path/to/python/interpreter");
        command.add("/path/to/python/script");
        command.add("arg_1");
        command.add("arg_n");

        SystemCommandExecutor commandExecutor = new SystemCommandExecutor(command);
        commandExecutor.executeCommand();

        StringBuilder stdout = commandExecutor.getStandardOutputFromCommand();
        StringBuilder stderr = commandExecutor.getStandardErrorFromCommand();

        System.out.println("STDOUT");
        System.out.println(stdout);
        System.out.println("STDERR");
        System.out.println(stderr);
    }
}
