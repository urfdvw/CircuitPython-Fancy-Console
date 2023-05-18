import json, sys, supervisor, time

CV_JSON_START = "<CV>"
CV_JSON_END = "</CV>"


class ConnectedVariablesManager:
    def __init__(self):
        self.vars = {}
        self.serial_updates = ""
        self.debug = True

    def define(self, var_name, initdata):
        """
        define a connected variable
        """
        assert type(var_name) == type(""), "var_name should be string"
        self.vars[var_name] = initdata

    def serial_read(self):
        """
        read CDC data from serial buffer if any
        don't use input() in other parts of the code
        """
        # read from serial
        while n_bytes := supervisor.runtime.serial_bytes_available:
            self.serial_updates += sys.stdin.read(n_bytes)
            time.sleep(0.01)
        if self.serial_updates and self.debug:
            print([self.serial_updates])
        # capture update data
        if self.serial_updates.endswith("\n"):  # if captured
            try:
                # parse
                serial_updates_dict = json.loads(self.serial_updates.strip())
                self.serial_updates = ""
                # check
                assert all(
                    [key in self.vars for key in serial_updates_dict]
                ), "get unknown variable names from serial"
                assert all(
                    [
                        type(self.vars[key]) == type(value)
                        for key, value in serial_updates_dict.items()
                    ]
                ), "variable type does not match from serial"
                # update
                if self.debug:
                    print(serial_updates_dict)
                self.vars.update(serial_updates_dict)
            except Exception as e:
                self.serial_updates = ""  # clean up bad data
                print(e)

    def read(self, var_names):
        """
        read a defined variable or a list of defined variables
        """
        # type enforce
        ## convert the input to a list if it is not
        if type(var_names) != type([]):
            var_names = [var_names]
        assert all(
            [type(name) == type("") for name in var_names]
        ), "all names should be strings"
        # get updates
        self.serial_read()
        # get values
        output = [self.vars[name] for name in var_names]
        if len(output) == 1:
            return output[0]
        return output

    def write(self, var_names, var_values):
        # type enforce
        if type(var_names) != type([]):
            var_names = [var_names]
            var_values = [var_values]
        assert all(
            [type(name) == type("") for name in var_names]
        ), "all names should be strings in python"
        assert all(
            [
                type(self.vars[name]) == type(value)
                for name, value in zip(var_names, var_values)
            ]
        ), "variable type does not match in python"
        # update
        updates_dict = {name: value for name, value in zip(var_names, var_values)}
        self.vars.update(updates_dict)
        if self.debug:
            print(CV_JSON_START + json.dumps(updates_dict) + CV_JSON_END)


cv = ConnectedVariablesManager()
cv.define("a", 1)
cv.define("b", 1.0)
cv.write("a", 10)
cv.write(["a", "b"], [100, 0.1])

while True:
    cv.write("a", cv.read("a") + 1)
    print(cv.read("a"))
    print(cv.read(["a", "b"]))
    time.sleep(1)
# {"a": 2}
# {"a": 1.5}
# {"b": 1.5}
# {"c": 2}
