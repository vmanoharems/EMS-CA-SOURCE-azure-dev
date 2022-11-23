SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[CreateCOAfromBudgetCategory]
(
@COAString varchar(500),
@Prodid int
)
AS
BEGIN

    declare @BudgetCategoryID varchar(50);
    declare @BudgetFileID int;
	declare @SSS1 varchar(50);
	declare @SSS2 varchar(50);
	declare @SSS3 varchar(50);
	declare @SSS4 varchar(50);
	declare @SSS5 varchar(50);
	declare @SSS6 varchar(50);
	declare @SSS7 varchar(50);
	declare @SSS8 varchar(50);

    DECLARE Cus_Category CURSOR FOR 
    select BudgetCategoryID,Budgetfileid,S1,S2,S3,S4,S5,S6,S7,S8 from BudgetCategory where BudgetCategoryID in (SELECT items as S1 FROM dbo.SplitId(@COAString,','))

	
	

open Cus_Category;
fetch next from Cus_Category into @BudgetCategoryID,@BudgetFileID,@SSS1,@SSS2,@SSS3,@SSS4,@SSS5,@SSS6,@SSS7,@SSS8

while @@FETCH_STATUS = 0
begin

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


	declare @COAStringNew varchar(500);


 select @SSS1=S1,@SSS2=S2,@SSS3=S3,@SSS4=S4,@SSS5=S5,@SSS6=S6,@SSS7=S7,@SSS8=S8 from BudgetCategory where Budgetfileid=@BudgetFileID and BudgetCategoryID=@BudgetCategoryID;
 
 if(@SSS3!='')
 begin
  set @COAStringNew=@SSS1+'|'+@SSS2+'|'+@SSS3;
 end
  if(@SSS4!='')
 begin
 set @COAStringNew=@COAStringNew+'|'+@SSS4;
 end
  if(@SSS5!='')
 begin
 set @COAStringNew=@COAStringNew+'|'+@SSS5;
 end
  if(@SSS6!='')
 begin
 set @COAStringNew=@COAStringNew+'|'+@SSS6;
 end
  if(@SSS7!='')
 begin
 set @COAStringNew=@COAStringNew+'|'+@SSS7;
 end
  if(@SSS8!='')
 begin
 set @COAStringNew=@COAStringNew+'|'+@SSS8;
 end
 
 insert into COA (COACode,ParentCode,SS1,SS2,SS3,SS4,SS5,SS6,SS7,SS8,ProdId) values
 (@COAStringNew,'',@SSS1,@SSS2,@SSS3,@SSS4,@SSS5,@SSS6,@SSS7,@SSS8,@Prodid)

  
   fetch next from Cus_Category into @BudgetCategoryID,@BudgetFileID,@SSS1,@SSS2,@SSS3,@SSS4,@SSS5,@SSS6,@SSS7,@SSS8

	   end
        end
       CLOSE Cus_Category
     DEALLOCATE Cus_Category





GO