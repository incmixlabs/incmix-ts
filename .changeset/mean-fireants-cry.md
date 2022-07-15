---
"@incmix/ts.runtime": minor
---

Fixed enum bug. Enum visitor now produces correct export output - however two nodes need be produced in order for the reference that the enum attribute makes to be resolved. Currently only one node is produced.
