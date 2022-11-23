SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetCRWRollUp]    -- exec GetCRWRollUp 1,1,3   --- GetCRWInfo 1,1,3
(
    @BudgetFileID int,
	@BudgetID int,
	@Prodid int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
SET NOCOUNT ON;
		
Declare @Mtree TABLE (CHILD Int,AccountCode varchar(50),PARENT Int,detaillevel Int,COAID Varchar(30),AccountName varchar(100),
Budget decimal(18,2),Posting bit,POAmount decimal(18,2),ActualtoDate decimal(18,2),ActualthisPeriod decimal(18,2),
EFC decimal(18,2),ETC decimal(18,2),ChildCount int,GENERATION int,hierarchy varchar(500), Budget1 decimal(18,2) null,POAmount1 decimal(18,2) null
,ActualtoDate1 decimal(18,2) null,ActualthisPeriod1 decimal(18,2) null, NotesCount int null,ExpandValue int,Type varchar(50),
ActualtoDateWithOutSet decimal(18,2) null,ActualthisPeriodWithOutSet decimal(18,2) null,SetBudget decimal(18,2),
SetEFC decimal(18,2),BlankBudget decimal(18,2),BlankEFC decimal(18,2)
)

Insert into @Mtree
	exec [dbo].[GetCRWInfo] @BudgetFileID,@BudgetID,@Prodid;
	
declare @COAID2 int;
declare @detailLevel2 int;  
declare @Budget2 decimal(18,2);
declare @POAmount2 decimal(18,2);
declare @ActualtoDate2 decimal(18,2);
declare @ActualthisPeriod2 decimal(18,2);
declare @NotesCount2 int;
declare @ChildCount2 int;

declare @SetAmt decimal(18,2);
declare @SetEFC decimal(18,2);
declare @BlankBudget decimal(18,2);
declare @SetBudget decimal(18,2);
declare @BlankEFC decimal(18,2);

declare @aa1 int;
declare @aa2 int;
declare @aa3 int;
declare @aa4 int;
declare @aa5 int;
declare @L2B decimal(18,2);
declare @L2C int;
declare @L2DB int;
declare @Adjust int;

declare @OldLevel int;
set @OldLevel=0;

DECLARE Cus_Category CURSOR FOR 
select COAID,detaillevel,Budget ,POAmount,ActualtoDate,ActualthisPeriod,ChildCount,SetBudget,SetEFC,BlankBudget,BlankEFC from @Mtree
	
open Cus_Category;
fetch next from Cus_Category into @COAID2,@detailLevel2,@Budget2 ,@POAmount2,@ActualtoDate2,@ActualthisPeriod2,@ChildCount2
	,@SetAmt,@SetEFC,@BlankBudget,@BlankEFC

while @@FETCH_STATUS = 0
begin
	select @NotesCount2= count(COAID) from CRWNotesNew where COAID=@COAID2 and BudgetFileID=@BudgetFileID and BudgetID=@BudgetID and ProdID=@Prodid;

	if(@detailLevel2=1)
		begin
			set @aa1=@COAID2;
			update @Mtree set POAmount1=@POAmount2,ActualtoDate1=@ActualtoDate2,ActualthisPeriod1=@ActualthisPeriod2,Budget1=Budget1+SetBudget+BlankBudget, NotesCount=@NotesCount2 where COAID=@aa1;
			set @OldLevel=1;
		end		
	else if(@detailLevel2=2)
		begin		  
			set @aa2=@COAID2;
			--update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,Budget1=Budget1+@Budget2+@SetAmt+@BlankBudget where COAID=@aa1;
				update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,Budget1=Budget1+@Budget2+@SetAmt where COAID=@aa1;
			update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,NotesCount=@NotesCount2,Budget1=Budget1+SetBudget+BlankBudget where COAID=@aa2;
			set @OldLevel=2;		
		end
	else if(@detailLevel2=3)
		begin
		   set @aa3=@COAID2;
		   update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2 where COAID=@aa1;
		   update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,Budget1=Budget1+@Budget2+@SetAmt+@BlankBudget where COAID=@aa2;
	       update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,NotesCount=@NotesCount2,Budget1=Budget+@SetAmt+@BlankBudget where COAID=@aa3;  
		   set @OldLevel=3;
		end
	else if(@detailLevel2=4)
		begin
		    set @aa4=@COAID2;
		    update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2 where COAID=@aa1;
			update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2 where COAID=@aa2;
		    update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,Budget1=Budget1+@Budget2+@SetAmt+@BlankBudget where COAID=@aa3;
	        update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,NotesCount=@NotesCount2,Budget1=Budget1+SetBudget+@BlankBudget where COAID=@aa4; 
		    set @OldLevel=4;
		end
	else if(@detailLevel2=5)
		begin
		    set @aa5=@COAID2;
		    update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2 where COAID=@aa1;
			update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2 where COAID=@aa2;
		    update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2 where COAID=@aa3;
	    	update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,Budget1=Budget1+@Budget2+@SetAmt+@BlankBudget where COAID=@aa4;
		    update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,NotesCount=@NotesCount2,Budget1=Budget1+SetBudget+@BlankBudget where COAID=@aa5; 
			set @OldLevel=5;
		end
 
        fetch next from Cus_Category into @COAID2,@detailLevel2,@Budget2 ,@POAmount2,@ActualtoDate2,@ActualthisPeriod2,@ChildCount2,@SetAmt ,@SetEFC,@BlankBudget,@BlankEFC
	 end
CLOSE Cus_Category
DEALLOCATE Cus_Category

declare @CHILDn Int;
declare @AccountCoden varchar(50);
declare @PARENTn Int;
declare @detailleveln Int;
declare @COAIDn Varchar(30);
declare @AccountNamen varchar(100);
declare @Budgetn decimal(18,2);
declare @Postingn bit;
declare @POAmountn decimal(18,2);
declare @ActualtoDaten decimal(18,2);
declare @ActualthisPeriodn decimal(18,2);
declare @EFCn decimal(18,2);
declare @ETCn decimal(18,2);
declare @ChildCountn int;
declare @GENERATIONn int;
declare @hierarchyn varchar(500);
declare @Budget1n decimal(18,2);
declare @POAmount1n decimal(18,2);
declare @ActualtoDate1n decimal(18,2);
declare @ActualthisPeriod1n decimal(18,2);
declare @NotesCountn int;
declare @ExpandValuen int;
declare @ActualtoDatenWithOutSet decimal(18,2);
declare @ActualthisPeriodnWithOutSet decimal(18,2);
  


Declare @CrwTable TABLE (CHILD Int,AccountCode varchar(50),PARENT Int,detaillevel Int,COAID Varchar(30),AccountName varchar(100),
	Budget decimal(18,2),Posting bit,POAmount decimal(18,2),ActualtoDate decimal(18,2),ActualthisPeriod decimal(18,2),
	EFC decimal(18,2),ETC decimal(18,2),ChildCount int,GENERATION int,hierarchy varchar(500), Budget1 decimal(18,2) null,
	POAmount1 decimal(18,2) null,ActualtoDate1 decimal(18,2) null
	,ActualthisPeriod1 decimal(18,2) null, NotesCount int null,ExpandValue int,BlankBudget decimal(18,2),SetBudget decimal(18,2)
	,BlankEFC decimal(18,2),SetEFC decimal(18,2)
);

DECLARE Cus_Category1 CURSOR FOR 
select CHILD ,AccountCode ,PARENT ,detaillevel ,COAID ,AccountName ,
	Budget ,Posting ,POAmount ,ActualtoDate ,ActualthisPeriod ,
	EFC ,ETC ,ChildCount ,GENERATION ,hierarchy , Budget1 ,
	POAmount1 ,ActualtoDate1 ,ActualthisPeriod1,NotesCount,ExpandValue,ActualtoDateWithOutSet,ActualthisPeriodWithOutSet,BlankBudget,SetBudget,SetEFC from @Mtree
	
open Cus_Category1;
fetch next from Cus_Category1 into @CHILDn , @AccountCoden , @PARENTn ,@detailleveln ,@COAIDn ,@AccountNamen ,@Budgetn ,
   @Postingn ,@POAmountn , @ActualtoDaten ,@ActualthisPeriodn , @EFCn , @ETCn , @ChildCountn , @GENERATIONn ,@hierarchyn ,
    @Budget1n ,@POAmount1n ,@ActualtoDate1n , @ActualthisPeriod1n,@NotesCountn,@ExpandValuen,@ActualtoDatenWithOutSet,
	@ActualthisPeriodnWithOutSet,@BlankBudget,@SetBudget,@SetEFC

while @@FETCH_STATUS = 0
	begin
		if(@Postingn=1)
			begin
				insert into @CrwTable values (@CHILDn , @AccountCoden , @PARENTn ,@detailleveln ,@COAIDn ,@AccountNamen ,@Budgetn ,
					@Postingn ,@POAmountn , @ActualtoDaten ,@ActualthisPeriodn , @EFCn , @ETCn , @ChildCountn , @GENERATIONn ,@hierarchyn ,
					@Budget1n ,@POAmount1n ,@ActualtoDate1n , @ActualthisPeriod1n,@NotesCountn,@ExpandValuen,0,0,@SetBudget,@SetEFC);

				insert into @CrwTable values (@CHILDn , @AccountCoden , @PARENTn ,@detailleveln+1 ,@COAIDn ,'(Blank)' ,@Budgetn ,
					@Postingn ,@POAmountn , @ActualtoDatenWithOutSet ,@ActualthisPeriodnWithOutSet , @EFCn , @ETCn , @ChildCountn , @GENERATIONn ,@hierarchyn ,
					@Budget1n ,@POAmount1n ,@ActualtoDate1n , @ActualthisPeriod1n,0,@ExpandValuen,@BlankBudget
					,[dbo].[GetBlankEFC](@COAIDn,@BudgetID,@BudgetFileID),NULL,@setEFC);
			end
		else
			begin
				insert into @CrwTable values (@CHILDn , @AccountCoden , @PARENTn ,@detailleveln ,@COAIDn ,@AccountNamen ,@Budgetn ,
				@Postingn ,@POAmountn , @ActualtoDaten ,@ActualthisPeriodn , @EFCn , @ETCn , @ChildCountn , @GENERATIONn ,@hierarchyn ,
				@Budget1n ,@POAmount1n ,@ActualtoDate1n , @ActualthisPeriod1n,@NotesCountn,@ExpandValuen,0,0,@SetBudget,@SetEFC);
	
			end
	  
	fetch next from Cus_Category1 into @CHILDn , @AccountCoden , @PARENTn ,@detailleveln ,@COAIDn ,@AccountNamen ,@Budgetn ,
		@Postingn ,@POAmountn , @ActualtoDaten ,@ActualthisPeriodn , @EFCn , @ETCn , @ChildCountn , @GENERATIONn ,@hierarchyn ,
		@Budget1n ,@POAmount1n ,@ActualtoDate1n , @ActualthisPeriod1n,@NotesCountn,@ExpandValuen,
		@ActualtoDatenWithOutSet,@ActualthisPeriodnWithOutSet,@BlankBudget,@SetBudget,@SetEFC
end
CLOSE Cus_Category1
DEALLOCATE Cus_Category1
	 
select CHILD ,AccountCode ,PARENT ,detaillevel ,COAID ,AccountName ,
	Budget ,Posting ,POAmount ,ActualtoDate ,ActualthisPeriod ,
	EFC ,ETC ,ChildCount ,GENERATION ,hierarchy , Budget1 ,
	POAmount1 ,ActualtoDate1 ,ActualthisPeriod1 , NotesCount ,ExpandValue,BlankBudget,isnull(SetBudget,0) as SetBudget,isnull(BlankEFC,0) as BlankEFC ,isnull(SetEFC,0) as SetEFC
from @CrwTable as a

END
GO