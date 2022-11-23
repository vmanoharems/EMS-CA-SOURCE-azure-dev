SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[CreateCOAfromBudgetAccount]
(
@COAString varchar(500),
@Prodid int
)
AS
BEGIN

    declare @BudgetAccountID varchar(50);
    declare @BudgetFileID int;
	declare @SSS1 varchar(50);
	declare @SSS2 varchar(50);
	declare @SSS3 varchar(50);
	declare @SSS4 varchar(50);
	declare @SSS5 varchar(50);
	declare @SSS6 varchar(50);
	declare @SSS7 varchar(50);
	declare @SSS8 varchar(50);
	declare @CategoryId int;
	declare @BudgetFileIDD int;
	declare @AccountNumber varchar(50);

    DECLARE Cus_Category CURSOR FOR 
    select CategoryId,BudgetFileID,AccountNumber from BudgetAccounts where BudgetAccountID in (SELECT items as S1 FROM dbo.SplitId(@COAString,',')) 
	

open Cus_Category;
fetch next from Cus_Category into @CategoryId,@BudgetFileIDD,@AccountNumber

while @@FETCH_STATUS = 0
begin

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	  select @SSS1=S1,@SSS2=S2,@SSS3=S3,@SSS4=S4,@SSS5=S5,@SSS6=S6,@SSS7=S7,@SSS8=S8 from BudgetCategory where cid in (@CategoryId) and Budgetfileid=@BudgetFileIDD

	
	declare @COAStringNew varchar(500);
	declare @segLevel int;
select @segLevel=SegmentLevel from Segment where ProdId=@Prodid and Classification='Detail'
 
 if(@segLevel=4)
 begin
  set @COAStringNew=@SSS1+'|'+@SSS2+'|'+@SSS3+'|'+@AccountNumber;
  set @SSS4= @SSS4+'>'+@AccountNumber;
 end
  if(@segLevel=5)
 begin
 set @COAStringNew=@SSS1+'|'+@SSS2+'|'+@SSS3+'|'+ @SSS4+'|'+@SSS3+'>'+ @AccountNumber;
  set @SSS5=@SSS5+'>'+@AccountNumber;
 end
  if(@segLevel=6)
 begin
 set @COAStringNew=@SSS1+'|'+@SSS2+'|'+@SSS3+'|'+ @SSS4+'|'+ @SSS5+'|'+@SSS3+'>'+ @AccountNumber;;
  set @SSS6=@SSS6+'>'+@AccountNumber;
 end
if(@segLevel=7)
 begin
 set @COAStringNew=@SSS1+'|'+@SSS2+'|'+@SSS3+'|'+ @SSS4+'|'+ @SSS5+'|'+ @SSS6+'|'+@SSS3+'>'+ @AccountNumber;;
  set @SSS7=@SSS7+'>'+@AccountNumber;
 end
 
 insert into COA (COACode,ParentCode,SS1,SS2,SS3,SS4,SS5,SS6,SS7,SS8,ProdId) values
 (@COAStringNew,'',@SSS1,@SSS2,@SSS3,@SSS4,@SSS5,@SSS6,@SSS7,@SSS8,@Prodid)

  
   fetch next from Cus_Category into @CategoryId,@BudgetFileIDD,@AccountNumber

	   end
        end
       CLOSE Cus_Category
     DEALLOCATE Cus_Category

	 select 1;




GO