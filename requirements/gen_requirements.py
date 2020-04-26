import sys

version = [1,0,2] #[a,b,c] is va.b.c

def emit_base_requirements():
    with open("requirements.txt", "r") as f:
        requirements = [r for r in f.read().split("\n") if r.split("==")[0] in blacklisted_pip_libraries]
        with open("base_requirements.txt", "w") as br:
            br.write("\n".join(requirements))

def emit_normal_requirements():
    with open("requirements.txt", "r") as f:
        requirements = [r for r in f.read().split("\n") if r.split("==")[0] not in blacklisted_pip_libraries]
        with open("nonbase_requirements.txt", "w") as nbr:
            nbr.write("\n".join(requirements))

def gen_incr_requirements():
    with open("requirements.txt", "r") as f:
        curr_requirements = f.read().split("\n")
    with open("base_requirements.txt", "r") as f:
        prev_requirements = f.read().split("\n")
    new_requirements = []
    for req in curr_requirements:
        if req not in prev_requirements:
            new_requirements.append(req)
    with open("new_requirements.txt", "w") as f:
        f.write("\n".join(new_requirements))

if __name__ == "__main__":
    gen_incr_requirements()
    
